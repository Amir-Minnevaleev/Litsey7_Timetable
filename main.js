function loadHTML(elementId, file) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(elementId).innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
}

window.onload = function() {
    loadHTML('window1', 'window1.html');
    loadHTML('window2', 'window2.html');
};
