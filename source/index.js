const { getIcons } = require("./fetching.js");

getIcons("https://medium.com/react-native-development/fixing-problems-in-react-native-caused-by-new-permission-model-on-android-1e547f754b8")
    .then(res => {
        console.log("RES", res);
    })
    .catch(err => {
        console.error(err);
    });
