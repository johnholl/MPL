


function dsFromTimestamp(timestamp) {
    let t = new Date( timestamp );
    // let formatted = t.toLocaleDateString();
    // return formatted
    let dd = String(t.getDate()).padStart(2, '0');
    let mm = String(t.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = t.getFullYear();

    let tstring = dd + '/' + mm + '/' + yyyy;
    return tstring;
};

export default dsFromTimestamp