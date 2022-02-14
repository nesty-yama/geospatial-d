let longLat = 36.11517610603418; // 緯度
let longLon = 139.10972180053537; // 経度
let intZoom = 16; // ズームレベル
let mapLayer = null;



// マップを表示
let map = L.map("map");
map.setView([longLat, longLon], intZoom);

mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
);
mapLayer.addTo(map);

//GeoJSONの地物をマップに追加
// <!-- 埼玉県_河川 -->
// L.geoJson(SAITAMA_River_GeoJSON).addTo(map);
// <!-- 埼玉県_緊急輸送道路 -->
// L.geoJson(SAITAMA_EmergencyRoad_GeoJSON).addTo(map);
// // <!-- 埼玉県_洪水浸水想定区域 -->// 洪水浸水想定区域と寸分違わぬ範囲で災害が起きたという想定とする。
fetch('data/simulation/SAITAMA_FllodHazardMap.geojson')
.then(response => response.json())
.then(data => {
  L.geoJson(data).addTo(map);
}).catch( (error) => {
  console.error('SAITAMA_FllodHazardMap の読み込み又は地物情報の反映時にエラーが発生しました。')
  console.error(error)
});
// // <!-- 埼玉県_土砂災害警戒区域 -->// 土砂災害警戒区域と寸分違わぬ範囲で災害が起きたという想定とする。
fetch('data/simulation/SAITAMA_SedimentDisasterMap.geojson')
.then(response => response.json())
.then(data => {
  L.geoJson(data).addTo(map);
}).catch( (error) => {
  console.error('SAITAMA_SedimentDisasterMap の読み込み又は地物情報の反映時にエラーが発生しました。')
  console.error(error)
});
// // <!-- 埼玉県_避難施設 -->
fetch('data/shelter/SAITAMA_Shelter.geojson')
.then(response => response.json())
// 避難施設は点データであり、利便性向上を目的として施設名称がマウスオーバーによって表示されるようにした。
.then(data => {
  data.features.forEach(
    row =>
    {
      //GeoJSONとmarkerは緯度経度をサイズ2の配列を期待している点で同じだが並び順は異なる。GeoJSON経度緯度の順だが、マーカーは緯度経度の順番を期待している。
      L.marker([row.geometry.coordinates[1],row.geometry.coordinates[0]],{ title: row.properties.P20_002 + '  ' + row.properties.P20_004 }).addTo(map);
    }
  )
}).catch( (error) => {
  console.error('SAITAMA_Shelter の読み込み又はマーカへの反映時にエラーが発生しました。')
  console.error(error)
});
// // <!-- 埼玉県長瀞町_道路及び信号機 -->
// L.geoJson(SAITAMA_Nagatoro_Road_GeoJSON).addTo(map);
// L.geoJson(SAITAMA_Nagatoro_Signal_GeoJSON).addTo(map);



// 表示座標を移動
function inputChange(){
  // 対象のinput要素.
  let addressInput = document.getElementById('address');
  let address = addressInput.value;

  // 緯度経度からAPIで住所を検索する
  getLatLngByAdreessForOpenStreetMap(address).then(latlng => {

      let lat = latlng.lat;
      let lng = latlng.lng;

      // 取得した緯度・経度が不正なら何もしない
      if(lat === 0 || lng === 0) return false;

      // 表示座標をセット
      map.setView([lat, lng]);
  });
}

//------------------------------------//
// 住所から緯度経度を返す OpenStreetMap
// address:住所
//------------------------------------//
const getLatLngByAdreessForOpenStreetMap = (address) =>
  new Promise((resolve, reject) => {
    // 地図情報を取得するAPIを呼び出し
    let result;
    let params = {
        format:"json"// 返り値の形式
      , q:address    // 検索ワード
    }
    /*Baseの場合はJSONPに対応していないため、jqueryでajax返す*///TODO コメント見直し。
    axios.get(
      'https://nominatim.openstreetmap.org"' // APIのURL
      , params
    )
    // 成功時
    .then(function(data){
      // 経度・緯度変数を初期化
      let lat = 0;
      let lon = 0;
      // OPMがマッチ率の高い順で返却してくる前提で、先頭の地物の緯度経度を設定する。
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
      console.log("XMLHttpRequest : " + XMLHttpRequest.status); // HTTPリクエストのステータス
      console.log("textStatus : " + textStatus); // タイムアウト、パースエラー等の情報
      console.log("errorThrown : " + errorThrown.message); // 例外情報
    });  
  });
