<?php namespace Milkyway\SS\FlashMessage;

use Milkyway\SS\FlashMessage\Contracts\BlocksNotifications;
use Session;

class SessionBlocker implements BlocksNotifications
{
    protected $id = 'blocked_messages';

    public function block($params = [])
    {
        $session = empty($params['area']) ? $this->id . '._' : $this->id . '.' . $params['area'];

        if(!empty($params['id'])) {
            $blocked = Session::get($session);
            $blocked[] = $params['id'];
            Session::set($session, array_unique($blocked));
        }

        if(!empty($params['content'])) {
            $blocked = Session::get($session);
            $blocked[] = $params['content'];
            Session::set($session, array_unique($blocked));
        }
    }

    public function isBlocked($params = []) {
        $session = empty($params['area']) ? $this->id . '._' : $this->id . '.' . $params['area'];

        if(!empty($params['id'])) {
            return in_array($params['id'], (array)Session::get($session));
        }

        if(!empty($params['content'])) {
            return in_array($params['content'], (array)Session::get($session));
        }

        return false;
    }
}
