import os
import re
import json
import shutil
import subprocess

# --- КОНФИГУРАЦИЯ ---
MUSIC_JS_PATH = 'music.js'  # Путь к вашему файлу music.js
SOURCE_DIR = 'input'  # Папка с исходными музыкальными файлами
OUTPUT_DIR = 'compressed_music' # Папка для сжатых и переименованных файлов
BITRATE = "192k"  # Битрейт для сжатия
FFMPEG_PATH = 'C:/ffmpeg/bin/ffmpeg.exe' # Путь к ffmpeg. Если ffmpeg в PATH, оставьте 'ffmpeg'.
                       # Укажите полный путь, если необходимо (например, 'C:/ffmpeg/bin/ffmpeg.exe')

# --- ПРОВЕРКА FFMPEG ---
def check_ffmpeg():
    """Проверяет, доступен ли ffmpeg."""
    try:
        # Пытаемся запустить ffmpeg с флагом -version и скрыть вывод
        subprocess.run([FFMPEG_PATH, '-version'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("FFmpeg найден.")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("\n--- ВАЖНО ---")
        print("FFmpeg не найден или не доступен по указанному пути.")
        print("Пожалуйста, скачайте и установите FFmpeg с https://ffmpeg.org/download.html")
        print("Убедитесь, что путь к 'ffmpeg' (папка 'bin') добавлен в системную переменную PATH,")
        print(f"или укажите полный путь в переменной FFMPEG_PATH в этом скрипте (текущее значение: '{FFMPEG_PATH}').")
        print("-------------")
        return False

# --- ФУНКЦИЯ 1: СЖАТИЕ АУДИО ---
def compress_audio(input_path, output_path, bitrate):
    """Сжимает аудиофайл с использованием ffmpeg."""
    try:
        command = [
            FFMPEG_PATH,
            '-i', input_path,      # Входной файл
            '-vn',                 # Без видео
            '-ab', bitrate,        # Установить битрейт аудио
            '-acodec', 'libmp3lame', # Использовать MP3 кодек
            '-ar', '44100',        # Частота дискретизации
            '-ac', '2',            # Стерео
            '-y',                  # Перезаписать выходной файл, если существует
            output_path            # Выходной файл
        ]
        print(f"  Выполнение: {' '.join(command)}")
        result = subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8')
        # print("  FFmpeg stdout:", result.stdout) # Раскомментируйте для отладки
        # print("  FFmpeg stderr:", result.stderr) # Раскомментируйте для отладки
        print(f"  Успешно сжато: {output_path}")
        return True
    except FileNotFoundError:
        print(f"  Ошибка: FFmpeg не найден по пути '{FFMPEG_PATH}'. Убедитесь, что он установлен и путь указан верно.")
        return False
    except subprocess.CalledProcessError as e:
        print(f"  Ошибка при сжатии {input_path}: {e}")
        print(f"  FFmpeg stderr: {e.stderr}")
        return False
    except Exception as e:
        print(f"  Неожиданная ошибка при обработке {input_path}: {e}")
        return False


# --- ФУНКЦИЯ 2: ПАРСИНГ MUSIC.JS И ПЕРЕИМЕНОВАНИЕ ---
def parse_music_js_and_process(filepath, source_dir, output_dir, bitrate):
    """Читает music.js, находит файлы, сжимает и переименовывает их."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            js_code = f.read()

        # Используем regex для извлечения массива данных
        match = re.search(r'const\s+musicData\s*=\s*(\[.*?\]);', js_code, re.DOTALL)
        if not match:
            print(f"Ошибка: Не удалось найти 'const musicData = [...]' в файле {filepath}")
            return None

        json_str = match.group(1)

        # Пытаемся загрузить как JSON
        music_data = json.loads(json_str)
        print(f"Успешно загружено {len(music_data)} записей из {filepath}.")

    except FileNotFoundError:
        print(f"Ошибка: Файл {filepath} не найден.")
        return None
    except json.JSONDecodeError as e:
        print(f"Ошибка парсинга {filepath} как JSON: {e}")
        print("  Пожалуйста, убедитесь, что массив в music.js имеет корректный JSON-подобный формат.")
        return None
    except Exception as e:
        print(f"Произошла ошибка при чтении или парсинге {filepath}: {e}")
        return None

    # --- Обработка файлов ---
    if not os.path.exists(source_dir):
        print(f"Ошибка: Исходная папка '{source_dir}' не найдена.")
        print("  Пожалуйста, создайте ее и поместите туда ваши музыкальные файлы.")
        return

    if not os.path.exists(output_dir):
        print(f"Создание выходной папки: {output_dir}")
        os.makedirs(output_dir)

    print(f"\nНачинается обработка файлов из '{source_dir}'...")

    processed_files = set()
    found_count = 0

    source_files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]

    for item in music_data:
        title_lower = item['title'].lower()
        item_id = item['id']
        found_match = False

        for filename in source_files:
            if filename in processed_files:
                continue # Пропускаем уже обработанные файлы

            # Проверяем, содержится ли title в имени файла (без учета регистра)
            if title_lower in filename.lower():
                print(f"\nНайдено совпадение:")
                print(f"  - Запись: '{item['title']}' (ID: {item_id})")
                print(f"  - Файл: '{filename}'")

                source_path = os.path.join(source_dir, filename)
                output_filename = f"{item_id}.mp3" # Всегда сохраняем как .mp3
                output_path = os.path.join(output_dir, output_filename)

                print(f"  Сжатие и сохранение в '{output_path}'...")
                if compress_audio(source_path, output_path, bitrate):
                    processed_files.add(filename)
                    found_count += 1
                    found_match = True
                    break # Переходим к следующей записи в music_data
                else:
                    print(f"  Не удалось обработать {filename}. Попробуем найти другой файл для этой записи.")


        if not found_match:
            print(f"\nПредупреждение: Не найден файл для записи '{item['title']}' (ID: {item_id})")

    print(f"\n--- ИТОГ ---")
    print(f"Обработано и сохранено файлов: {found_count}")

    unprocessed_files = set(source_files) - processed_files
    if unprocessed_files:
        print(f"Необработанные файлы (не найдено совпадений в {MUSIC_JS_PATH}):")
        for f in unprocessed_files:
            print(f"  - {f}")
    else:
         print("Все файлы из исходной папки были обработаны.")

# --- ОСНОВНОЙ БЛОК ---
if __name__ == "__main__":
    print("Запуск скрипта обработки музыки...")

    # 1. Проверяем наличие FFmpeg
    if not check_ffmpeg():
        exit() # Выход, если FFmpeg не найден

    # 2. Создаем папки, если их нет (для удобства)
    if not os.path.exists(SOURCE_DIR):
        print(f"Создание папки для исходных файлов: {SOURCE_DIR}")
        os.makedirs(SOURCE_DIR)
        print("  Пожалуйста, поместите ваши музыкальные файлы в эту папку.")

    if not os.path.exists(MUSIC_JS_PATH):
        print(f"Файл {MUSIC_JS_PATH} не найден.")
        print("  Пожалуйста, убедитесь, что файл music.js находится в той же папке, что и скрипт,")
        print("  или укажите правильный путь в переменной MUSIC_JS_PATH.")
        print("  Скрипт не может продолжить работу без этого файла.")
        exit()

    # 3. Запускаем основной процесс
    parse_music_js_and_process(MUSIC_JS_PATH, SOURCE_DIR, OUTPUT_DIR, BITRATE)

    print("\nСкрипт завершил работу.")