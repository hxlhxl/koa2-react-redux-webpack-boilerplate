const users = {
    "login": {
        "error": {
            "error_id": 0,
            "error_str": '',
        },
        "data": {
            "users": [{
                    "name": "huaxiong",
                    "age": 24,
                    "sex": "male"
                },
                {
                    "name": "zhaojaijin",
                    "age": 24,
                    "sex": "male"
                }
            ]
        }
    }
};
module.exports = () => users;