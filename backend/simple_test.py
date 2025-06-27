import subprocess
import time
import sys

def test_health():
    """Test simple de l'endpoint health"""
    try:
        # Utiliser curl ou PowerShell selon la disponibilité
        result = subprocess.run([
            'powershell', '-Command', 
            '(Invoke-WebRequest -Uri "http://127.0.0.1:8000/health/" -UseBasicParsing).Content'
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ SERVEUR FONCTIONNE!")
            print("📄 Réponse:")
            print(result.stdout)
            return True
        else:
            print("❌ Erreur PowerShell:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    print("🧪 TEST SIMPLE DU SERVEUR")
    print("=" * 30)
    test_health() 