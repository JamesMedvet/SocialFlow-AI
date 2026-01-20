
# Passo a Passo: Social Flow AI no Lenovo G470 (Lubuntu)

Siga este guia para configurar seu ambiente de desenvolvimento 100% gratuito.

## 1. Preparando o Lubuntu (Terminal)
Abra o terminal (`Ctrl+Alt+T`) e instale as ferramentas necessárias:

```bash
# Atualize os repositórios
sudo apt update && sudo apt upgrade -y

# Instale o Node.js e Git
sudo apt install nodejs npm git -y

# Verifique a instalação
node -v
npm -v
```

## 2. Criando o Projeto
Utilizaremos o Vite para rapidez (ideal para hardware antigo como o G470):

```bash
# Crie a pasta do projeto
mkdir social-flow-ai && cd social-flow-ai

# Inicialize o repositório git
git init

# (O código já foi fornecido nos arquivos anteriores)
```

## 3. Configurando o Repositório GitHub
1. Crie uma conta no [GitHub](https://github.com).
2. No seu terminal:
```bash
git add .
git commit -m "Initial commit: Social Flow AI logic"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/social-flow-ai.git
git push -u origin main
```

## 4. Colocando no Ar (Hospedagem Grátis)
Recomendamos o **Vercel** ou **Netlify**:
1. Conecte sua conta do GitHub ao [Vercel](https://vercel.com).
2. Selecione o repositório `social-flow-ai`.
3. **CRÍTICO:** Nas "Environment Variables" (Variáveis de Ambiente), adicione:
   - `API_KEY`: Sua chave do Gemini API (obtenha grátis em [ai.google.dev](https://ai.google.dev)).
4. Clique em **Deploy**.

## 5. Dicas de Performance para o G470
- O Lubuntu já é leve, mas evite ter muitas abas do Chrome abertas enquanto o `npm run dev` está rodando.
- Use o VS Code com poucas extensões.

---
**Criado por James Andrade**
