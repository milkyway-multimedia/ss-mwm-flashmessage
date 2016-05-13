<?php namespace Milkyway\SS\FlashMessage;

use Milkyway\SS\FlashMessage\Contracts\BlocksNotifications;

class NullBlocker implements BlocksNotifications
{
    public function block($params = [])
    {

    }

    public function isBlocked($params = []) {
        return false;
    }
}
