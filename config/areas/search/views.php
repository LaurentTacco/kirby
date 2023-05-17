<?php

return [
	'search' => [
		'pattern' => 'search',
		'action'  => function () {
			return [
				'component' => 'k-search-view',
				'props' => [
					'type' => get('type') ?? 'pages',
				]
			];
		}
	],
];