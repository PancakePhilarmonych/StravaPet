import { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  // Проверка токена при старте
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setLoggedIn(true);
      fetchActivities(token);
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      window.history.replaceState({}, document.title, '/');
      axios.post('http://localhost:3001/auth/strava', { code }).then((res) => {
        const token = res.data.access_token;
        localStorage.setItem('access_token', token);
        setLoggedIn(true);
        fetchActivities(token);
      });
    }
  }, []);

  const fetchActivities = async (token: string) => {
    try {
      const res = await axios.get('http://localhost:3001/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (err) {
      console.error('Ошибка получения активностей', err);
    }
  };

  const handleLogin = async () => {
    const redirectUri = encodeURIComponent('http://localhost:8081');
    const res = await fetch(`http://localhost:3001/auth/strava/redirect?redirect_uri=${redirectUri}`);
    if (!res.ok) {
      const text = await res.text();
      console.error('Ошибка от backend:', text);
      return;
    }
    const data = await res.json();
    window.location.href = data.url;
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setActivities([]);
    setLoggedIn(false);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 80, alignItems: 'center' }}>
      {!loggedIn ? (
        <>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>StravaPet</Text>
          <Button title="Войти через Strava" onPress={handleLogin} />
        </>
      ) : (
        <>
          <Text style={{ fontSize: 22, marginBottom: 12 }}>🏃‍♂️ Последние пробежки:</Text>
          {activities.length === 0 && <Text>Загрузка...</Text>}
          {activities.map((act, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>📅 {new Date(act.start_date).toLocaleDateString()}</Text>
              <Text>🏷 {act.name}</Text>
              <Text>📏 {(act.distance / 1000).toFixed(2)} км</Text>
              <Text>⏱ {(act.moving_time / 60).toFixed(0)} мин</Text>
            </View>
          ))}
          <Button title="Выйти" onPress={handleLogout} />
        </>
      )}
    </ScrollView>
  );
}
