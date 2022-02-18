/**********************************************************
 * スタイル操作 JS
 * (index.html)
 **********************************************************/

/*-----------------------------------------------------
  メニューボタン開閉
-------------------------------------------------------*/
function fnClickHeaderMenu() {
  // ボタン
  let btnMenuEl = document.getElementById('btnMenu');
  btnMenuEl.classList.toggle('is-open');
  // メニュー内部
  let menuEl = document.getElementById('menu');
  menuEl.classList.toggle("is-open");
}
