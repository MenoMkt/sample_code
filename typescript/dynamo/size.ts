import dynoItemSize = require('dyno-item-size');


/**
 * dynoItemSizeによるレコードサイズ取得サンプル
 */
console.log(dynoItemSize({
    hoge: 'hoge'
}))
console.log(dynoItemSize({
    fuga: {
        hoge: 'hoge',
        test: 1
    }
}))
console.log(dynoItemSize(
    [
        {
            "name": "test",
            "p": 0
        },
        {
            "name": "test2",
            "p": 1,
            "t": [
                "S"
            ]
        },
        {
            "name": "test3",
            "p": 0
        },
        {
            "name": "test4",
            "p": 1,
            "t": [
                "S"
            ]
        },
        {
            "name": "test5",
            "p": 1,
            "t": [
                "S"
            ]
        },
        {
            "i_col": [
                "name"
            ],
            "name": "test7",
            "p": 1,
            "t": [
                "S"
            ]
        },
        {
            "name": "test7",
            "p": 0
        },
        {
            "e_col": [
                "age",
                "name"
            ],
            "name": "test8",
            "p": 1,
            "t": [
                "S"
            ]
        }
    ]
))

