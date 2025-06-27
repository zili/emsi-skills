#!/usr/bin/env python3
import sqlite3
import os

print("🔍 VÉRIFICATION DE LA BASE DE DONNÉES SQLite")
print("=" * 50)

# Vérifier si SQLite est disponible
try:
    import sqlite3
    print("✅ SQLite disponible")
    print(f"   Version SQLite: {sqlite3.sqlite_version}")
    print(f"   Module Python sqlite3: {sqlite3.version}")
except ImportError:
    print("❌ SQLite non disponible")
    exit(1)

# Vérifier si le fichier db.sqlite3 existe
db_file = "db.sqlite3"
if os.path.exists(db_file):
    print(f"✅ Fichier {db_file} existe")
    file_size = os.path.getsize(db_file)
    print(f"   Taille: {file_size} bytes")
else:
    print(f"❌ Fichier {db_file} n'existe pas")
    exit(1)

# Se connecter à la base de données et lister les tables
try:
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    # Obtenir la liste des tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print(f"\n📊 TABLES DANS LA BASE DE DONNÉES ({len(tables)} tables)")
    print("-" * 50)
    
    app_tables = []
    django_tables = []
    
    for table in tables:
        table_name = table[0]
        if table_name.startswith('auth_') or table_name.startswith('django_') or table_name.startswith('sqlite_'):
            django_tables.append(table_name)
        else:
            app_tables.append(table_name)
    
    print("🏗️  Tables de l'application:")
    for table in sorted(app_tables):
        # Compter les enregistrements
        cursor.execute(f"SELECT COUNT(*) FROM {table};")
        count = cursor.fetchone()[0]
        print(f"   - {table} ({count} enregistrements)")
    
    print(f"\n⚙️  Tables système Django: {len(django_tables)} tables")
    
    # Vérifier le superutilisateur
    cursor.execute("SELECT COUNT(*) FROM accounts_user WHERE is_superuser=1;")
    superuser_count = cursor.fetchone()[0]
    print(f"\n👤 Superutilisateurs: {superuser_count}")
    
    conn.close()
    print("\n✅ Base de données SQLite fonctionnelle !")
    
except Exception as e:
    print(f"❌ Erreur lors de l'accès à la base de données: {e}")
    exit(1) 