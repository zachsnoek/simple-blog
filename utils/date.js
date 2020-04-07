exports.formatMDY = function(date) {
    const options = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };
    
    return new Date().toLocaleDateString("en-us", options);
}