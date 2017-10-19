import moment from 'moment';

const momentUtil = {
    // Parse
        // Unix Timestamp (Seconds)
        unix: function(timestamp) {
            // timestamp: moment所创建的时间,不仅仅是时间戳，比如 2017-05-25 14:34:08也可以
            return moment(timestamp).unix();
        },
    
    // format
    // 从moment()返回值格式化
    // momemtValue.format('YYYYMMDD')
    
    // Query
    isSameOrBefore: function isSameOrBefore(a,b) {
        return moment(a).isSameOrBefore(moment(b))
    },

    parseQid2Day: function(qid) {
        const day = moment.unix(qid/1000).format('YYYYMMDD');
        return day;
    },
    // Duration
        // creating
        createDuration: function(options) {
            // options: ({seconds: 2,minutes: 2,hours: 2,days: 2,weeks: 2,months: 2,years: 2}
            return moment.duration(options);
        }
}


export default momentUtil;