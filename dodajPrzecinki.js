import * as fs from "fs";

const nazwaPlikuWejsciowego = 'country.json';
const nazwaPlikuWyjsciowego = 'plik_wyjsciowy.json';

fs.readFile(nazwaPlikuWejsciowego, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const obiekty = data.split('}\n'); // Podziel na obiekty na podstawie nowej linii

  const noweObiekty = obiekty.map((obiekt, index) => {
    return index === obiekty.length - 1 ? obiekt + ',' : obiekt + '},';
  });

  const nowaData = noweObiekty.join('\n');

  fs.writeFile(nazwaPlikuWyjsciowego, nowaData, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Przecinki dodane po końcu obiektów. Zapisano jako', nazwaPlikuWyjsciowego);
  });
});

