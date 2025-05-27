import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import json

# Укажи свои ключи от Spotify API
CLIENT_ID = '23332a2f6abe430fadec862cd4e10bf4'
CLIENT_SECRET = 'c921d6ee44a74a5f81485280c78b44b9'

# Авторизация
auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(auth_manager=auth_manager)

# ID плейлиста
playlist_id = '3hqWWWwaNflFPwQffTGQSq'

# Получение треков
results = sp.playlist_tracks(playlist_id)
music_data = []

for i, item in enumerate(results['items']):
    track = item['track']
    if track is None:
        continue
    title = track['name']
    composer = ', '.join(artist['name'] for artist in track['artists'])
    cover = track['album']['images'][0]['url'] if track['album']['images'] else ''
    src = track['external_urls']  # Ссылка на трек в Spotify
    print(src)

#     music_data.append({
#         'id': f'm{i+1}',
#         'title': title,
#         'composer': composer,
#         'src': src,
#         'cover': cover
#     })

# # Печать в формате JavaScript
# print('const musicData = ' + json.dumps(music_data, indent=2, ensure_ascii=False) + ';\n')
# print('export default musicData;')
