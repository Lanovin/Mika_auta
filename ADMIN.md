# Administrace vozů

## Přihlášení

Společné přihlášení je dostupné na `/prihlaseni`.

Běžní návštěvníci si zde mohou vytvořit účet přes uživatelské jméno, e-mail a heslo.
Administrace vozů je přístupná speciálním účtem:

- Uživatelské jméno: `admin`
- Heslo: `admin`

Po přihlášení admin účtu se zpřístupní stránka `/admin`.

Před produkčním nasazením doporučujeme změnit `AUTH_SESSION_SECRET` v `.env.local` podle vzoru v `.env.example` a upravit admin heslo v `data/users.json`.

## Co klient zvládne z administrace

- přidat nový vůz
- upravit cenu, parametry a popis
- nahrát hlavní fotku i další galerii
- skrýt vůz z veřejné nabídky bez smazání
- zvýraznit vůz na domovské stránce
- smazat neaktuální inzerát

## Uložení dat

Vozy jsou uložené v `data/inventory.json`.
Nahrané obrázky se ukládají do `public/uploads/vehicles`.

## Poznámka k hostingu

Tato administrace zapisuje data a obrázky do souborů na serveru. Je vhodná pro klasický Node.js hosting nebo VPS s trvalým diskem. Pro čistě serverless hosting bez trvalého úložiště je vhodnější přejít na databázi a object storage.
