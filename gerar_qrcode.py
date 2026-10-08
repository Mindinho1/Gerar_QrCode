import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image
import os

BASE_DIR = r"C:\Users\User\Desktop\Trabalho"
url = "http://172.31.50.114:3000"
logo_path = os.path.join(BASE_DIR, "anchado_logo.png")
output_path = os.path.join(BASE_DIR, "qrcode_app.png")

# Gerar QR Code com alta correção de erro (necessário para ter logo no centro)
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # H = 30% de redundância
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Criar imagem com módulos arredondados e cores personalizadas
img = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(),
    color_mask=SolidFillColorMask(
        front_color=(30, 30, 60),   # azul escuro
        back_color=(255, 255, 255)  # fundo branco
    )
).convert("RGBA")

# Abrir e redimensionar o logo (máximo 25% do tamanho do QR Code)
logo = Image.open(logo_path).convert("RGBA")
qr_width, qr_height = img.size
max_logo_size = int(qr_width * 0.25)

logo.thumbnail((max_logo_size, max_logo_size), Image.LANCZOS)
logo_width, logo_height = logo.size

# Adicionar fundo branco atrás do logo para legibilidade
padding = 10
bg = Image.new("RGBA", (logo_width + padding * 2, logo_height + padding * 2), (255, 255, 255, 255))

# Calcular posição central
logo_pos_x = (qr_width - logo_width) // 2
logo_pos_y = (qr_height - logo_height) // 2
bg_pos_x = logo_pos_x - padding
bg_pos_y = logo_pos_y - padding

# Colar fundo e logo no QR Code
img.paste(bg, (bg_pos_x, bg_pos_y), bg)
img.paste(logo, (logo_pos_x, logo_pos_y), logo)

# Salvar resultado final
img.save(output_path)
print(f"QR Code com logo gerado com sucesso: {output_path}")
print(f"URL codificada: {url}")
