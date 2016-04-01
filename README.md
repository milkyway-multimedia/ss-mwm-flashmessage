Milkyway Multimedia - Silverstripe Core Extensions
==================================================
This is a bit special to use, to add area specific pages you have to prepend your calls with the area you would like to add it to. For example:

```
    singleton('message')->cms()->add('Yay! My pretty messages');
```

If you want to add more, you can chain but you always must prepend the area.

```
    singleton('message')->cms()->info('Yay! My pretty messages')->cms()->error('A bad message');
```

- Add a global message
  `singleton('message')->add($content, $level, $timeout, $priority, $dismissable, $area)`
- Add a global message by array (you can add an id if you use this method)
  `singleton('message')->add($params)`
- Growl example
  `singleton('message')->cms()->note('grrr...')`
- Remove a global message
  `singleton('message')->remove($content, $level, $area)`
- Remove a global message by array (you can remove by id if you use this method)
  `singleton('message')->remove($params)`
- Add a link to call before displaying notifications (for calls to APIs)
  `singleton('message')->before($link)`
- Force load CSS & JS for certain area (for API based messages)
  `singleton('message')->style($area)`

#### Available areas
Areas are mapped to controllers. The following areas are available:

- cms: Will add a global message to the CMS
- page: Will add a global message to any Page
- form: Will add a global message during a form request
- global: Add a global message

By default the cms area is used. Any other value will add a message to any controller. So you can use ->global() to add a global message.

#### Available levels
- info
- success
- error
- warning
- modal: Show a message modal, this will attempt to either use a bootstrap modal, jquery ui modal, vex alert or javascript alert (ordered by priority)
- note: Show a growl notification, this will attempt to either use a Messenger, vex alert, CMS notification or javascript alert (ordered by priority)

By default the cms area is used. Any other value will add a message to any controller. So you can use ->global() to add a global message.

#### How it works
This messaging system is javascript based. It should work on most controllers as long as it accesses Silverstripe requirements.

## Install
Add the following to your composer.json file

```

    "require"          : {
		"milkyway-multimedia/ss-mwm-flashmessage": "dev-master"
	}

```

## License
* MIT

## Version
* Version 0.1 (Alpha)

## Contact
#### Mellisa Hankins
* E-mail: mellisa.hankins@me.com
* Twitter: [@mi3ll](https://twitter.com/mi3ll "mi3ll on twitter")
* Website: mellimade.com.au
