<?php namespace Milkyway\SS\FlashMessage;

use Milkyway\SS\FlashMessage\Contracts\BlocksNotifications;
use Session;
use Controller as Control;
use Requirements;

class Notifier
{
    /* @var string Key for storage which holds these messages */
    protected $id = 'messages';

    /* @var string Default area to display message */
    protected $defaultArea = 'cms';

    /* @var string Default message level */
    protected $defaultLevel = 'info';

    /* @var array Support message levels */
    protected $levels = [
        'info',
        'success',
        'error',
        'warning',
        'modal',
        'note',
    ];

    /* @var array Links to load before notifications are inserted (for messages from APIs) */
    protected $before = [];

    /* @var array Areas with JS already included */
    protected $jsIncluded = [];

    /** bool Only allow unique messages */
    protected $unique = true;

    /* @var string Current area to display message */
    protected $workingArea = '';

    /* @var \Milkyway\SS\FlashMessage\Contracts\BlocksNotifications Takes care of the blocker */
    protected $blocker;

    public function __construct(BlocksNotifications $blocker)
    {
        $this->blocker = $blocker;
        $this->defaultArea = singleton('env')->get('messages.default_area', $this->defaultArea);
        $this->defaultLevel = singleton('env')->get('messages.default_level', $this->defaultLevel);

        singleton('env')->set('messages.dir', basename(rtrim(dirname(dirname(__FILE__)), DIRECTORY_SEPARATOR)));
    }

    /**
     * Add a message to the notifier
     *
     * @param $content
     * @param string $level
     * @param int $timeout
     * @param int $priority
     * @param bool $dismissable
     * @param string $area
     * @return $this
     */
    public function add($content, $level = '', $timeout = 0, $priority = 0, $dismissable = true, $area = '')
    {
        $area = $area ?: is_array($content) && isset($content['area']) ? $content['area'] : $this->workingArea ?: $this->defaultArea;
        $level = $level ?: $this->defaultLevel;

        if (!$this->canView($area)) {
            return $this;
        }

        $content = is_array($content) ? $content : [
            'content'     => $content,
            'level'       => $level,
            'timeout'     => $timeout,
            'priority'    => $priority,
            'dismissable' => $dismissable,
        ];

        if($this->blocker()->isBlocked($content)) {
            return;
        }

        $this->style($area);

        $messages = (array)Session::get($this->id . '.' . $area);

        if($dismissable && !isset($content['dismiss_link'])) {
            $content['dismiss_link'] = singleton('Milkyway\SS\FlashMessage\Controller')->Link('dismiss' . '?' . http_build_query([
                    'area' => $area,
                    'id' => empty($content['id']) ? '' : $content['id'],
                    'content' => empty($content['content']) ? '' : $content['content'],
                ]));
        }

        array_unshift($messages, $content);

        Session::set($this->id . '.' . $area, $messages);

        $this->clearWorking();

        return $this;
    }

    /**
     * Remove a message from the notifier
     *
     * @param string $content
     * @param string $level
     * @param string $area
     * @return $this
     */
    public function remove($content = null, $level = '', $area = '')
    {
        $area = $area ?: $this->workingArea ?: $this->defaultArea;
        $level = $level ?: $this->defaultLevel;

        $this->clear(is_array($content) ? $content : [
            'content' => $content,
            'level'   => $level,
            'area'    => $area,
        ]);

        $this->clearWorking();

        return $this;
    }

    /**
     * Clear a message that matches a set of params
     *
     * @param array $params
     * @return $this
     */
    public function clear($params = [])
    {
        if (isset($params['level']) || isset($params['content'])) {
            $level = isset($params['level']) ? $params['level'] : '';
            $content = isset($params['content']) ? $params['content'] : '';
            $area = isset($params['area']) ? $params['area'] : '';
            $messages = $area ? (array)Session::get($this->id . '.' . $area) : (array)Session::get($this->id);

            $adjust = function ($messages) use ($content, $level) {
                $new = [];

                foreach ($messages as $message) {
                    if ($content && $level && $message['content'] != $content && $message['level'] != $level) {
                        $new[] = $message;
                    } else {
                        if ($content && !$level && $message['content'] != $content) {
                            $new[] = $message;
                        } else {
                            if (!$content && $level && $message['level'] != $level) {
                                $new[] = $message;
                            }
                        }
                    }
                }

                return $new;
            };

            if ($area) {
                Session::set($this->id . '.' . $area, $adjust($messages));
            } else {
                foreach ($messages as $area => $areaMessages) {
                    Session::set($this->id . '.' . $area, $adjust($areaMessages));
                }
            }
        } else {
            if (isset($params['area'])) {
                Session::clear($this->id . '.' . $params['area']);
            }
        }

        return $this;
    }

    /**
     * Get messages for an area
     * @param string $area
     * @return array
     */
    public function get($area = '')
    {
        $area = $area ?: $this->workingArea ?: $this->defaultArea;
        $messages = (array)Session::get($this->id . '.' . $area);
        Session::clear($this->id . '.' . $area);
        $this->clearWorking();

        if ($this->unique) {
            $content = [];
            $messages = array_filter($messages, function ($message) use (&$content) {
                if (in_array($message['content'], $content)) {
                    return false;
                } else {
                    array_push($content, $message['content']);

                    return true;
                }
            });
        }

        $messages = array_filter($messages, function($message) use($area) {
            $params = $message;
            $params['area'] = $area;
            return !$this->blocker()->isBlocked($params);
        });

        // Sorting is handled in JS
//        return usort($messages, function($a, $b) {
//            return $a['priority'] - $b['priority'];
//        });

        return $messages;
    }

    /**
     * Add a link to execute before messages are added
     * @param $link
     * @param string $area
     */
    public function before($link, $area = '')
    {
        $area = $area ?: $this->workingArea ?: '';

        if (isset($this->before[$link])) {
            $this->before[$link] = array_merge($this->before[$link], explode(',', $area));
        } else {
            $this->before[$link] = explode(',', $area);
        }

        $this->clearWorking();
    }

    public function removeBefore($link, $area = '')
    {
        if (!isset($this->before[$link])) {
            return;
        }

        $area = $area ?: $this->workingArea ?: '';

        $this->before[$link] = array_diff($this->before[$link], explode(',', $area));

        $this->clearWorking();
    }

    /**
     * Handle some fancy stuff for getting messages
     *
     * @param $name
     * @param $arguments
     * @return $this|mixed
     */
    public function __call($name, $arguments)
    {
        if (in_array($name, $this->levels)) {
            $content = array_shift($arguments);
            return call_user_func_array([$this, 'add'], array_merge([$content, $name], $arguments));
        }

        $this->workingArea = $name;

        return $this;
    }

    /**
     * Include JS and CSS for flash messages
     * @param string $area
     * @param array $levels
     */
    public function style($area)
    {
        if (in_array($area,
                $this->jsIncluded) || singleton('env')->get('messages.exclude_js') || singleton('env')->get('messages.exclude_' . $area . '_js')
        ) {
            return;
        }

        $params = [
            'Before' => '',
            'Link'   => singleton('Milkyway\SS\FlashMessage\Controller')->Link($area),
        ];

        foreach ($this->before as $link => $areas) {
            if (empty($areas) || in_array($area, $areas)) {
                $params['Before'] .= $link . ',';
            }
        }

        $params['Before'] = trim($params['Before'], ',');

        Requirements::javascriptTemplate(
            singleton('env')->get('messages.dir') . '/js/mwm.flash-messages.link.js',
            $params,
            singleton('env')->get('messages.dir') . '/js/mwm.flash-messages.link.js:' . $area
        );

        $this->jsIncluded[] = $area;

        if (!singleton('env')->get('messages.exclude_lib_js')) {
            Requirements::javascript(THIRDPARTY_DIR . '/jquery/jquery.js');

            Requirements::javascript(singleton('env')->get('messages.dir') . '/js/mwm.flash-messages.js');
        }

        if (!singleton('env')->get('messages.exclude_lib_css')) {
            Requirements::css(singleton('env')->get('messages.dir') . '/css/mwm.flash-messages.css');
        }
    }

    /**
     * Get the blocker that blocks notifications
     * @return BlocksNotifications
     */
    public function blocker() {
        return $this->blocker;
    }

    /**
     * Set a new blocker on this notifier
     * @param BlocksNotifications $blocker
     * @return $this
     */
    public function setBlocker(BlocksNotifications $blocker) {
        $this->blocker = $blocker;
        return $this;
    }

    /**
     * Check whether the area is limited by controller type
     * @param $area
     * @return bool
     */
    protected function canView($area)
    {
        $notifierController = singleton('Milkyway\\SS\\FlashMessage\\Controller');

        if(Control::curr() instanceof $notifierController) {
            return true;
        }

        $mapping = (array)singleton('env')->get('messages.mapping');

        if (isset($mapping[$area])) {
            $allowed = array_filter((array)$mapping[$area]);

            foreach ($allowed as $controller) {
                if (is_a(Control::curr(), $controller)) {
                    return true;
                }
            }

            return false;
        }

        return true;
    }

    protected function clearWorking() {
        $this->workingArea = '';
    }
}
