import dayjs from 'dayjs';
import moment from 'moment'

/**
 * dayjsのフォーマット関数サンプル
 */
const prevDayDate = dayjs().add(-1, 'day');
console.log({ prevDayDate })
const str = [...Array(prevDayDate.get('date'))]
    .map((_val, i) => {
        console.log(prevDayDate.subtract(i, 'day').format(`DD`))
        return prevDayDate.subtract(i, 'day').format(`'DD'`)
    })
    .join(',')


console.log(str);
console.log(Array(prevDayDate.get('date')).length)

console.log(dayjs('2021-02-03 01:09:26+0900').toISOString())
console.log(dayjs('2021-02-03 01:09:26+0900').locale())
console.log(dayjs('2021-02-03 01:09:26+0900').format())
console.log(dayjs('2021-02-03 01:09:26+0900').format('YYYY-MM-DD HH:mm:ss+0900'))
console.log(dayjs(dayjs('2021-02-03 01:09:26+0900').format('YYYY-MM-DD HH:mm:ss+0900')).format())


console.log(dayjs('2021-02-24 12:19:59+0900').isBefore(dayjs('2021-02-25T14:19:59+09:00')))


console.log(moment(1619407299424).format('YYYY/MM/DD HH:mm:ss'))
