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
L.geoJson(SAITAMA_FllodHazardMap_GeoJSON).addTo(map);
// // <!-- 埼玉県_土砂災害警戒区域 -->// 土砂災害警戒区域と寸分違わぬ範囲で災害が起きたという想定とする。
L.geoJson(SAITAMA_SedimentDisasterMap_GeoJSON).addTo(map);
// // <!-- 埼玉県_避難施設 -->
// L.geoJson(SAITAMA_Shelter_GeoJSON).addTo(map);
// 避難施設は点データであり、利便性向上を目的として施設名称がマウスオーバーによって表示されるようにした。
SAITAMA_Shelter_GeoJSON.features.forEach(
  row =>
  {
    //GeoJSONとmarkerは緯度経度をサイズ2の配列を期待している点で同じだが並び順は異なる。GeoJSON経度緯度の順だが、マーカーは緯度経度の順番を期待している。
    L.marker([row.geometry.coordinates[1],row.geometry.coordinates[0]],{ title: row.properties.P20_002 + '  ' + row.properties.P20_004 }).addTo(map);
  }
)
// // <!-- 埼玉県長瀞町_道路及び信号機 -->
// L.geoJson(SAITAMA_Nagatoro_Road_GeoJSON).addTo(map);
// L.geoJson(SAITAMA_Nagatoro_Signal_GeoJSON).addTo(map);