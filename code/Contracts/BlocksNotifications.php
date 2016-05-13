<?php namespace Milkyway\SS\FlashMessage\Contracts;

/**
 * Milkyway Multimedia
 * BlocksNotifications.php
 *
 * @package milkyway-multimedia/dispoze.com.au
 * @author Mellisa Hankins <mell@milkywaymultimedia.com.au>
 */

interface BlocksNotifications
{
    public function block($params = []);

    public function isBlocked($params = []);
}
