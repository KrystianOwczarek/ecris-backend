import * as fs from "fs";

const nazwaPlikuWejsciowego = 'country.json';
const nazwaPlikuWyjsciowego = 'plik_wyjsciowy.json';

function searchAndSave(countryName, inputFileName, outputFileName) {
  try {
    // Wczytaj zawartość pliku JSON
    const jsonData = fs.readFileSync(inputFileName, 'utf8');

    // Popraw niestandardowy format dodając przecinki między obiektami
    const correctedJsonData = `[${jsonData.replace(/\}\s*\{/g, '},{')}]`;

    // Sparsuj poprawioną zawartość pliku jako obiekt JSON
    const data = JSON.parse(correctedJsonData);

    // Filtruj obiekty zawierające podaną nazwę kraju i adresy IPv4
    const filteredData = data.filter(item => 
      item.country_name.toLowerCase() === countryName.toLowerCase() &&
      isIPv4(item.start_ip) && isIPv4(item.end_ip)
    );

    // Zapisz pasujące obiekty do nowego pliku JSON
    const outputData = JSON.stringify(filteredData, null, 2);
    fs.writeFileSync(outputFileName, outputData, 'utf8');

    console.log(`Pasujące obiekty zostały zapisane do pliku: ${outputFileName}`);
  } catch (error) {
    console.error('Błąd podczas przetwarzania pliku JSON:', error.message);
  }
}

// Funkcja sprawdzająca, czy dany ciąg jest adresem IPv4
function isIPv4(ip) {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipv4Pattern.test(ip);
}

// Przykładowe użycie: przeszukaj plik.json w poszukiwaniu obiektów z krajem "United Kingdom" i zapisz tylko adresy IPv4 do nowego pliku wynikowego.json
searchAndSave('Portugal', 'country.json', 'wynikowy.json');