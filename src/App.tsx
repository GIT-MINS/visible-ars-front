/* OS: Windows 11 25H2 | Node: v24.11.1 */
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface ArsData {
  status: string;
  menus: string[];
}

const SOCKET_SERVER_URL = 'http://localhost:3000';

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [arsData, setArsData] = useState<ArsData | null>(null);

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('✅ 접속 성공');
      setIsConnected(true);
    });

    socket.on('ars_update', (data: any) => {
      // [진단] 실제 들어오는 데이터 구조를 문자열로 찍어서 확인
      console.log('📩 원본 데이터:', JSON.stringify(data));
      setArsData({ ...data });
    });

    return () => { socket.disconnect(); };
  }, []);

  // ▼▼▼▼ 여기가 핵심 진단 구간입니다 ▼▼▼▼
  
  // 1. 데이터가 아직 없을 때 (빨간 화면)
  if (!arsData) {
    return (
      <div style={{ backgroundColor: '#fee2e2', height: '100vh', padding: '50px', border: '5px solid red' }}>
        <h1 style={{ color: 'red', fontSize: '30px' }}>🔴 상태: 데이터 없음 (null)</h1>
        <p>현재 백엔드 연결 상태: {isConnected ? "연결됨 (ON)" : "끊김 (OFF)"}</p>
        <p>PowerShell 명령어를 보내보세요.</p>
      </div>
    );
  }

  // 2. 데이터가 들어왔을 때 (초록 화면)
  return (
    <div style={{ backgroundColor: '#dcfce7', height: '100vh', padding: '50px', border: '5px solid green' }}>
      <h1 style={{ color: 'green', fontSize: '30px' }}>🟢 상태: 데이터 수신 성공!</h1>
      
      {/* 데이터 강제 출력 */}
      <div style={{ background: 'black', color: 'yellow', padding: '20px', margin: '20px 0', fontFamily: 'monospace' }}>
        {JSON.stringify(arsData, null, 2)}
      </div>

      <h2>화면 표시 테스트:</h2>
      <h3>제목: {arsData.status}</h3>
      <ul>
        {/* 배열이 없어도 에러 안 나도록 안전장치(?.) 추가 */}
        {arsData.menus?.map((menu, i) => (
          <li key={i} style={{ fontSize: '20px', margin: '10px 0' }}>👉 {menu}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;