const accordions = document.querySelectorAll(".accordion");
for (const accordion of accordions) {
  const panels = accordion.querySelectorAll(".accordion-panel");
  for (const panel of panels) {
    const head = panel.querySelector(".accordion-header");
    head.addEventListener('click', () => {
      for (const otherPanel of panels) {
        if (otherPanel !== panel) {
          otherPanel.classList.remove('accordion-expanded');
        }
      }
      panel.classList.toggle('accordion-expanded');
    });
  }
}


ymaps.ready(init); 
function init(){
    var mPlayMap = new ymaps.Map("map",{center: [55.75985606898725,37.61054750000002],zoom: 12});
    myMap.controls.add("zoomControl").add("typeSelector").add("mapTools");
    var mycemark = new ymaps.Placemark([55.75985606898725,37.61054750000002]);
    myMap.geoObjects.add(myPlacemark);	
}



