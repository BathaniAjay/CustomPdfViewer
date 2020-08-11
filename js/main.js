const url = '../docs/dummy.pdf';

let pdfDoc = null,
pageNum = 1,
pageIsRendering = true,
pageIsPending = null;

const scale = 1.5,
canvas = document.querySelector('#pdf-render'),
ctx =canvas.getContext('2d');

const renderPage = num =>{
  pageIsRendering = true;

// getting page 
pdfDoc.getPage(num).then(page =>{
  // setting scale 
  const viewport = page.getViewport({ scale });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  // console.log(page);

  const renderCtx = {
    canvasContext:ctx,
    viewport
  };
  page.render(renderCtx).promise.then(() => {
    pageIsRendering = false;

    if(pageIsPending !== null) {
      renderPage(pageIsPending);
      pageIsPending = null;
    }
  });

  // output 
  document.querySelector('#page-num').textContent = num;
});
};

// check for the pages rendering 
const queueRendering = num =>{
  if(pageIsRendering){
    pageIsPending = num;

  }else {
    renderPage(num);
  }
}
const showPrevPage = () =>{
  if(pageNum <= 1) {
    return;
  }
   pageNum--;
   queueRendering(pageNum);

}

const showNextPage = () =>{
  if(pageNum >= pdfDoc.numPages) {
    return;
  }
   pageNum++;
   queueRendering(pageNum);

}

pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>{
  pdfDoc = pdfDoc_;
  console.log(pdfDoc);
  document.querySelector('#page-total').textContent = pdfDoc.numPages;
  renderPage(pageNum);
})
.catch(err => {
  // Display error
  const div = document.createElement('div');
  div.className = 'error';
  div.appendChild(document.createTextNode("Something went wrong"));
  document.querySelector('body').insertBefore(div, canvas);
  // Remove top bar
  document.querySelector('.top-bar').style.display = "none";
});

document.querySelector("#prev-button").addEventListener('click',showPrevPage);
document.querySelector("#next-button").addEventListener('click',showNextPage);
