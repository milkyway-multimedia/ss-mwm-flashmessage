<?php namespace Milkyway\SS\FlashMessage;

use Controller as Original;
use Requirements;
use RequestHandler;

class Controller extends Original
{
    private static $allowed_actions = [
        'refresh',
        'dismiss',
    ];

    private static $url_handlers = [
        '$Area!' => 'refresh',
    ];

    /**
     * Grab available notifications
     *
     * @param $request
     * @return array|\SS_HTTPResponse|void
     * @throws \SS_HTTPResponse_Exception
     */
    public function refresh($request)
    {
        $area = $request->param('Area');

        // Kind of a hack for making sure it goes back to its old ways if an allowed action is set
        if ($area != __FUNCTION__ && in_array(str_replace('-', '_', $area), $this->allowedActions())) {
            return RequestHandler::handleAction($request, str_replace('-', '_', $area));
        }

        // Only available via AJAX
        if (!$request->isAjax()) {
            return $this->httpError(404);
        }

        Requirements::clear();

        // If no area specified, do nothing
        if (!$area) {
            return [];
        }

        // Add additional messages via an extension (if you want to call an API etc.)
        $this->extend('onRefresh', $area, $request);

        Requirements::clear();

        $response = $this->getResponse();
        $response->addHeader('Content-type', 'application/json');
        $response->setBody(json_encode(singleton('message')->$area()->get()));
        return $response;
    }

    public function dismiss($request)
    {
        // Only available via AJAX
        if (!$request->isAjax()) {
            return $this->httpError(404);
        }

        $area = $request->getVar('area');
        $this->extend('onDismiss', $area, $request);

        singleton('message')->blocker()->block([
            'area'    => $area,
            'content' => $request->getVar('content'),
            'id'      => $request->getVar('id'),
        ]);

        $response = $this->getResponse();
        $response->addHeader('Content-type', 'application/json');
        $response->setBody('');
        return $response;
    }

    /**
     * Get link for an area, for templates
     * @param string $area
     * @return String
     */
    public function Link($area = '')
    {
        return $this->join_links('notifications', $area);
    }
}
