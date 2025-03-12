document.addEventListener("DOMContentLoaded", function () {
    // fetch("bus_schedule.json") // JSONファイルを読み込む
    fetch("https://raw.githubusercontent.com/tonytani37/timetable_ajinadai_kita/refs/heads/main/bus_schedule.json") // JSONファイルを読み込
        .then(response => response.json())
        .then(data => {
            const routes = data["阿品台北発"];
            const routeSelect = document.getElementById("routeSelect");
            const scheduleDiv = document.getElementById("schedule");

            // 路線選択肢を追加
            Object.keys(routes).forEach(company => {
                Object.keys(routes[company]).forEach(route => {
                    const option = document.createElement("option");
                    option.value = route;
                    option.textContent = `${company} - ${route}`;
                    routeSelect.appendChild(option);
                });
            });

            // 路線が選択されたら時刻表を表示
            routeSelect.addEventListener("change", function () {
                const selectedRoute = this.value;
                scheduleDiv.innerHTML = ""; // 以前の表示をクリア

                if (selectedRoute) {
                    let selectedCompany;
                    Object.keys(routes).forEach(company => {
                        if (routes[company][selectedRoute]) {
                            selectedCompany = company;
                        }
                    });

                    const scheduleData = routes[selectedCompany][selectedRoute];

                    // テーブルを作成
                    const table = document.createElement("table");

                    // ヘッダー
                    const thead = document.createElement("thead");
                    thead.innerHTML = `
                        <tr>
                            <th>時間</th>
                            <th>平日</th>
                            <th>土曜・日曜・祝日</th>
                        </tr>
                    `;
                    table.appendChild(thead);

                    // ボディ
                    const tbody = document.createElement("tbody");

                    // 時間ごとに時刻表を分割して整理
                    const timeTable = { "平日": {}, "土曜・日曜・祝日": {} };
                    
                    // 平日の時刻を時間ごとに分類
                    scheduleData["時刻表"]["平日"].forEach(time => {
                        const hour = time.split(":")[0]; // 時間部分を取得
                        const minits = time.split(":")[1]; // 分部分を取得
                        if (!timeTable["平日"][hour]) timeTable["平日"][hour] = [];
                        // timeTable["平日"][hour].push(time);
                        timeTable["平日"][hour].push(minits);
                    });

                    // 土日祝の時刻を時間ごとに分類
                    scheduleData["時刻表"]["土曜・日曜・祝日"].forEach(time => {
                        const hour = time.split(":")[0];
                        const minits = time.split(":")[1]; // 分部分を取得
                        if (!timeTable["土曜・日曜・祝日"][hour]) timeTable["土曜・日曜・祝日"][hour] = [];
                        // timeTable["土曜・日曜・祝日"][hour].push(time);
                        timeTable["土曜・日曜・祝日"][hour].push(minits);
                    });

                    // 時間ごとにテーブル行を生成
                    const allHours = new Set([...Object.keys(timeTable["平日"]), ...Object.keys(timeTable["土曜・日曜・祝日"])]);
                    [...allHours].sort().forEach(hour => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${hour}時</td>
                            <td>${(timeTable["平日"][hour] || []).join(", ") || "-"}</td>
                            <td>${(timeTable["土曜・日曜・祝日"][hour] || []).join(", ") || "-"}</td>
                        `;
                        tbody.appendChild(row);
                    });

                    table.appendChild(tbody);
                    scheduleDiv.appendChild(table);
                }
            });
        })
        .catch(error => console.error("JSONの読み込みに失敗しました:", error));
});
