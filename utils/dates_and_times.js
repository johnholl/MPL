


function dsFromTimestamp(timestamp) {
    let t = new Date( timestamp );
    let formatted = t.toLocaleDateString();
    return formatted
};

export default dsFromTimestamp