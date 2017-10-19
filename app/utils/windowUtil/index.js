const windowUtil = {
    viewPort: (function() {
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return {
            width,
            height
        }
    })()
}


export default windowUtil;