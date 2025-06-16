import React, { useState, useEffect } from 'react';

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const loadGoogleAPI = () => {
      if (window.gapi) {
        window.gapi.load('client:auth2', initializeGapi);
      }
    };

    const initializeGapi = () => {
      window.gapi.client.init({
        apiKey: 'AIzaSyAhLeV8oc9WxW_C_veDWJNbht3pMw3bo3E',
        clientId: '602590860366-f89h82shb9qglf381fb1odjaiioi2kju.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
      }).then(() => {
        setIsLoaded(true);
        const authInstance = window.gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
      }).catch((error) => {
        console.error('Erro na inicialização:', error);
      });
    };

    if (window.gapi) {
      loadGoogleAPI();
    } else {
      window.addEventListener('load', loadGoogleAPI);
    }

    return () => {
      window.removeEventListener('load', loadGoogleAPI);
    };
  }, []);

  const loadEvents = async () => {
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
      });
      setEvents(response.result.items || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const signIn = async () => {
    try {
      await window.gapi.auth2.getAuthInstance().signIn();
      setIsSignedIn(true);
      loadEvents();
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  const signOut = async () => {
    try {
      await window.gapi.auth2.getAuthInstance().signOut();
      setIsSignedIn(false);
      setEvents([]);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  if (!isLoaded) {
    return <div>Carregando Google Calendar...</div>;
  }

  return (
    <div>
      {!isSignedIn ? (
        <button onClick={signIn} className="drive-btn">
          Conectar Google Calendar
        </button>
      ) : (
        <div>
          <button onClick={signOut} className="drive-btn">
            Desconectar
          </button>
          <button onClick={loadEvents} className="drive-btn" style={{marginLeft: '10px'}}>
            Atualizar
          </button>
        </div>
      )}
      
      <div className="eventos-lista">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className="evento-item">
              <span className="evento-time">
                {event.start.dateTime 
                  ? new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                  : 'Dia inteiro'
                }
              </span>
              <span className="evento-title">{event.summary || 'Sem título'}</span>
            </div>
          ))
        ) : (
          isSignedIn && <div>Nenhum evento encontrado</div>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendar;