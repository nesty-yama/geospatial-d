let longLat = 36.11517610603418; // 緯度
let longLon = 139.10972180053537; // 経度
let intZoom = 16; // ズームレベル
let mapLayer = null;


// マップ定義
let map = L.map("map");

// スケール表示
let control = L.control.scale({maxWidth: 200, imperial: false, position: 'bottomleft'}).addTo(map);

// featureGroup等を定義
mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
);
map.group = new L.featureGroup([],{}); // ここに、オープンデータのレイヤーをセットする

// 定義したfeatureGroup等をmapにセット
mapLayer.addTo(map);
map.group.addTo(map);

// マップ表示
map.setView([longLat, longLon], intZoom);

// ページ読み込み時に実行
window.onload = function(){
  // 初期処理
  // チェックを付ける
  let element = document.getElementById('SingleElderlyHome');
  element.checked = true;

  // 単身高齢者を表示
  showSingleElderlyHome();
}

//GeoJSONの地物をマップに追加
// 単身高齢者宅
function showSingleElderlyHome(){
  // アイコン設定
  let iconSingleElderlyHome = L.icon({
    iconUrl: './image/icon_home.png',
    iconSize: [32, 32],
  });
  // マップに表示
  fetch('data/support/SingleElderlyHome.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJson(data,{
      onEachFeature: function onEachFeature(feature,layer){
        layer.setIcon(iconSingleElderlyHome);
        layer.properties = {
          classification: "SingleElderlyHome",
        };
        // ポップアップの中身を作る
        let popupContents = "<div>"
        + "<div>名前:" + feature.properties.Name + "</div>"
        + "<div>年齢:" + feature.properties.age + "</div>"
        + "<div>持病:" + feature.properties.chronic + "</div>"
        + "<div>所持品:" + feature.properties.instrument + "</div>"
        + "<div>ステータス:" + feature.properties.status + "</div>"
        + "<div>歩行:" + convertWalkable(feature.properties.walkable) + "</div>"
        + "</div>"
        // Leafletアイコンから表示するポップアップの設定
        let popup = L.popup({
          closeButton: false,
          minWidth: 200,
        }).setContent(popupContents);
        layer.bindPopup(popup);
        // mapにセット
        map.group.addLayer(layer);
      }
    });
  }).catch( (error) => {
    console.error('SingleElderlyHome の読み込み又は地物情報の反映時にエラーが発生しました。')
    console.error(error)
  });
}

// <!-- 埼玉県_河川 -->
// L.geoJson(SAITAMA_River_GeoJSON).addTo(map);
// <!-- 埼玉県_緊急輸送道路 -->
// L.geoJson(SAITAMA_EmergencyRoad_GeoJSON).addTo(map);

// <!-- 埼玉県_洪水浸水想定区域 -->// 洪水浸水想定区域と寸分違わぬ範囲で災害が起きたという想定とする。
function showFllodHazardMap(){
  // スタイル設定
  let styleFllodHazard = {
    "color": "#C2302A",
  }
  // マップに表示
  fetch('data/simulation/SAITAMA_FllodHazardMap.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJson(data,{
      style: styleFllodHazard,
      onEachFeature: function onEachFeature(feature,layer){
        layer.properties = {
          classification: "FllodHazardMap",
        };
        map.group.addLayer(layer);
      }
    });
  }).catch( (error) => {
    console.error('SAITAMA_FllodHazardMap の読み込み又は地物情報の反映時にエラーが発生しました。')
    console.error(error)
  });
}

// <!-- 埼玉県_土砂災害警戒区域 -->// 土砂災害警戒区域と寸分違わぬ範囲で災害が起きたという想定とする。
function showSedimentDisasterMap(){
  // スタイル設定
  let styleSedimentDisaster = {
    "color": "#ED6D35",
  }
  // マップに表示
  fetch('data/simulation/SAITAMA_SedimentDisasterMap.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJson(data,{
      style: styleSedimentDisaster,
      onEachFeature: function onEachFeature(feature,layer){
        layer.properties = {
          classification: "SedimentDisasterMap",
        };
        map.group.addLayer(layer);
      }
    });
  }).catch( (error) => {
    console.error('SAITAMA_SedimentDisasterMap の読み込み又は地物情報の反映時にエラーが発生しました。')
    console.error(error)
  });
}

// <!-- 埼玉県_避難施設 -->
function showShelter(){
  // アイコン設定
  let iconShelter = L.icon({
    iconUrl: './image/icon_hinan.png',
    iconSize: [32, 32],
  });
  // マップに表示
  fetch('data/shelter/SAITAMA_Shelter.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJson(data,{
      onEachFeature: function onEachFeature(feature,layer){
        layer.setIcon(iconShelter);
        layer.properties = {
          classification: "Shelter",
        };
        // ポップアップの中身を作る
        let popupContents = "<div>"
        + "<div>名称:" + feature.properties.P20_002 + "</div>"
        + "<div>種類:" + feature.properties.P20_004 + "</div>"
        + "</div>"
        // Leafletアイコンから表示するポップアップの設定
        let popup = L.popup({
          closeButton: false,
          minWidth: 200,
        }).setContent(popupContents);
        layer.bindPopup(popup);
        // mapにセット
        map.group.addLayer(layer);
      }
    });
  }).catch( (error) => {
    console.error('SAITAMA_Shelter の読み込み又はマーカへの反映時にエラーが発生しました。')
    console.error(error)
  });
}
// // <!-- 埼玉県長瀞町_道路及び信号機 -->
// L.geoJson(SAITAMA_Nagatoro_Road_GeoJSON).addTo(map);
// L.geoJson(SAITAMA_Nagatoro_Signal_GeoJSON).addTo(map);

var num = 0;
var watch_id;
// 現在地を継続取得
let watchGpsStart = () =>{
    watch_id = navigator.geolocation.watchPosition((position)=>{
      map.setView([position.coords.latitude, position.coords.longitude]);
      L.marker([position.coords.latitude, position.coords.longitude], { title: "今の場所" }).addTo(map);
    }, function(e) { alert(e.message); }, {"enableHighAccuracy": true, "timeout": 20000, "maximumAge": 2000});
};

// 現在地継続取得をやめる
let watchGpsStop = () =>{
    navigator.geolocation.clearWatch(watch_id);
}


// 表示切替
function changeDisplayStatus(e){
  let id = e.target.id;
  var isChecked = e.target.checked;
  // チェックがついているなら表示、ついていないなら非表示
  if(isChecked){
    showContents(id);
  } else {
    hideContents(id);
  }
}
// レイヤーを表示する
function showContents(id){
  // 単身高齢者宅
  if(id == "SingleElderlyHome"){
    showSingleElderlyHome();
  }
  // 土砂災害区域
  if(id == "SedimentDisasterMap"){
    showSedimentDisasterMap();
  }
  // 避難所
  if(id == "Shelter"){
    showShelter();
  }
  // 洪水浸水想定区域
  if(id == "FllodHazardMap"){
    showFllodHazardMap();
  }
}
// レイヤーを非表示にする
function hideContents(id){
  // groupのレイヤーを全取得
  let layers = map["group"].getLayers();
  for(let layer of layers) {
    // 指定分類のレイヤーのみ削除
    if(layer.properties.classification == id) {
      // レイヤー削除
      map.group.removeLayer(layer);
    }
  }
}
//
function convertWalkable(walkable){
  if(walkable === 0){
    return "×"
  }
  if(walkable === 1){
    return "〇"
  }
  return "Error!!"
}

// 表示座標を移動
function inputChange(){
  // 対象のinput要素.
  let addressInput = document.getElementById('address');
  let address = addressInput.value;

  // 緯度経度からAPIで住所を検索する
  getLatLngByAdreessForOpenStreetMap(address).then(latlng => {

      let lat = latlng.lat;
      let lng = latlng.lng;

      // 日本国内を想定しているため、ガーナ湾沖(緯度:0,経度0)の場合、視点移動を行わない。
      if(lat === 0 || lng === 0) return;

      // 表示座標をセット
      map.setView([lat, lng]);
  });
}

//------------------------------------//
// OpenStreetMapの機能を使って住所キーワードから経度・緯度オブジェクトを返す
// @Params address:住所
// 住所をもとに合致する地物がない場合は(緯度:0,経度0)の経度・緯度オブジェクトを返却する。
// ※日本国内を想定しているため、ガーナ湾沖(緯度:0,経度0)が検索結果となることはない。
//------------------------------------//
const getLatLngByAdreessForOpenStreetMap = (address) =>
  new Promise((resolve, reject) => {
    // 地図情報を取得するAPIを呼び出し
    let result;
    let params = {
        format:"json"// 返り値の形式
      , q:address    // 検索ワード
    }
    console.log(params);
    // 検索ワードに該当する地物一覧をOSMから取得する。
    axios.get(
      'https://nominatim.openstreetmap.org' // APIのURL
      , {
        'params': params
      }
    )
    // 成功時
    .then(function(response){
      let data = response.data;
      // 経度・緯度変数を初期化
      let lat = 0;
      let lon = 0;
      // OSMがマッチ率の高い順で返却してくる前提で、先頭地物の緯度経度を設定する。
      if (data.length > 0) {
        lat = data[0].lat;
        lon = data[0].lon;
      }
      // leafletの経度・緯度オブジェクトにセットして返す
      let latlng = L.latLng(lat, lon);
      resolve(latlng);
    })
    // エラー時
    .catch(function (error) {
      console.log(error);
      console.log("XMLHttpRequest : " + XMLHttpRequest.status); // HTTPリクエストのステータス
      console.log("textStatus : " + textStatus); // タイムアウト、パースエラー等の情報
      console.log("errorThrown : " + errorThrown.message); // 例外情報
    });
  });
