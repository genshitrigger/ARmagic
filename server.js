const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let players = { player1: null, player2: null };

server.on('connection', (ws) => {
    console.log("クライアントが接続しました");

    ws.on('message', (message) => {
        console.log("メッセージ受信: " + message);

        if (message == 'join_player1') {
            players.player1 = ws;
            console.log("プレイヤー1が参加しました");
            // プレイヤー1にはプレイヤー2を待機させるメッセージを送信
            ws.send('waiting_for_player2');
        } else if (message == 'join_player2') {
            players.player2 = ws;
            console.log("プレイヤー2が参加しました");
            if (players.player1) {
                // プレイヤー1とプレイヤー2両方にマッチング成立メッセージを送信
                players.player1.send('match_found');
                players.player2.send('match_found');
                console.log("マッチング成立");
            } else {
                // プレイヤー2が来ても、まだプレイヤー1がいない場合
                ws.send('waiting_for_player1');
            }
        }
    });

    ws.on('close', () => {
        if (players.player1 == ws) players.player1 = null;
        if (players.player2 == ws) players.player2 = null;
    });
});

console.log("WebSocket server is running on ws://localhost:8080");
