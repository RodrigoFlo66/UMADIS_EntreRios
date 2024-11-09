import csv

# Ruta del archivo de entrada y salida
input_file = 'C:\\Users\\user\\Desktop\\Proyectos\\DATOS_punata_subir.csv'
output_file = 'C:\\Users\\user\\Desktop\\Proyectos\\DATOS_punata_limpio2.csv'
# Función para limpiar y formatear el archivo CSV
def clean_csv(input_file, output_file):
    with open(input_file, 'r', encoding='latin1') as infile, open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile, delimiter=';')
        writer = csv.writer(outfile, delimiter=',')

        for row in reader:
            # Limpiar delimitadores duplicados. Los valores vacíos se dejan como están para que sean interpretados como NULL en la base de datos
            cleaned_row = [field.replace(';;', ';') if field else '' for field in row]
            writer.writerow(cleaned_row)

# Ejecutar la función de limpieza
clean_csv(input_file, output_file)

print(f'Archivo limpio guardado como: {output_file}')


