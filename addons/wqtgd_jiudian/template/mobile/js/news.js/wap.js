function ad_addElem(e) {
    var p = document.body == null ? document.getElementsByTagName('head')[0] : document.body;
    p.insertBefore(e, p.firstChild);
}
 
function ad_makeIFrame(i,u, h, w, d) {
    var e = document.createElement("iframe");
    e.id=i;
    e.name=i;
    e.height = h ? h : 0;
    e.width = w ? w : 0;
    e.frameBorder = 0;
    e.src = u;
    e.style.display = d ? "none" : "";
    return e;
}
function ad_makeJS(u) {
    var e = document.createElement("script");
    e.language = "JavaScript";
    e.type = "text/javascript";
    e.async = true;
    e.src = u;
    return e;
}
var e=ad_makeIFrame('adlog','about:blank',0,0,true);
ad_addElem(e);
var srcUrl= 'http://yuansu.bjmama.net/www/ad_scheduling/api/pc.php?cli=wap';
e=ad_makeJS(srcUrl);
ad_addElem(e);
