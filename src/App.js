import React, { useState } from "react";
import "./App.css"; // Importando os estilos
import { jsPDF } from 'jspdf';

function Formulario() {
  // Estado para armazenar os valores do formulário
  const [formValues, setFormValues] = useState({
    nomealuno: '',
    datanasc: '',
    genero: '',
    idade: '',
    escola: '',
    serie: '',
    endereco: '',
    bairro: '',
    nomeresp: '',
    ocupacao: '',
    contato: '',
    hora: '',
    hora_final: '',
    mensalidade: '',
    data_inicio: '',
    data_assinatura: '',
    dias: [], // Assegurando que 'dias' seja um array
  });

  // Função para atualizar os valores do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormValues((prevState) => {
        const newDays = checked
          ? [...prevState.dias, value] // Adiciona o dia ao array se marcado
          : prevState.dias.filter((day) => day !== value); // Remove o dia do array se desmarcado
        return { ...prevState, dias: newDays };
      });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // Função para gerar o PDF
  const gerarPDF = () => {
    const doc = new jsPDF();
  
    // Título formatado
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 255); // Azul
    doc.text('Contrato de Matrícula', 105, 40, null, null, 'center');
  
    // Subtítulo
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100); // Cinza
    doc.text('Informações do aluno e contrato', 105, 50, null, null, 'center');
  
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 255); // Azul
    doc.line(20, 55, 195, 55);
  
    // Dados do formulário
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Preto
    const fields = [
      { label: 'Nome do aluno(a):', value: formValues.nomealuno },
      { label: 'Data de Nascimento:', value: formValues.datanasc },
      { label: 'Sexo:', value: formValues.genero },
      { label: 'Idade:', value: formValues.idade },
      { label: 'Escola:', value: formValues.escola },
      { label: 'Série:', value: formValues.serie },
      { label: 'Endereço:', value: formValues.endereco },
      { label: 'Bairro:', value: formValues.bairro },
      { label: 'Nome do responsável:', value: formValues.nomeresp },
      { label: 'Ocupação:', value: formValues.ocupacao },
      { label: 'Contato:', value: formValues.contato },
      { label: 'Horário de Aula:', value: `${formValues.hora} - ${formValues.hora_final}` },
      { label: 'Mensalidade:', value: `${formValues.mensalidade} até ${formValues.data_inicio}` },
      { label: 'Data de Assinatura:', value: formValues.data_assinatura },
      { label: 'Dias de aula:', value: formValues.dias.join(', ') },
    ];
  
    let yPos = 65;
    fields.forEach((field) => {
      doc.text(`${field.label} ${field.value}`, 20, yPos);
      yPos += 10; // Espaçamento
    });
  
    // CNPJ
    doc.setFontSize(10);
    doc.text("CNPJ: 19.848.909/0001-22", 20, yPos);
    yPos += 10;
  
    // Observações
    doc.setTextColor(255, 0, 0); // Vermelho
    doc.text("Observações:", 20, yPos);
  
    const maxWidth = 170;
    const observacoes = [
      "Atividades interdisciplinares, não se encaixam como reforço escolar! (Caso esse serviço seja solicitado será cobrado valor fora parte).",
      "Autorização da imagem permitida para divulgar a imagem do meu filho nas redes sociais do reforço escolar."
    ];
  
    observacoes.forEach((texto) => {
      const lines = doc.splitTextToSize(texto, maxWidth);
      lines.forEach((line) => {
        yPos += 10;
        doc.text(line, 20, yPos);
      });
    });
  
    // Assinaturas
    yPos += 20;
    doc.setTextColor(0, 0, 0);
    doc.text("Contratante:", 20, yPos);
    doc.line(20, yPos + 5, 150, yPos + 5);
  
    yPos += 20;
    doc.setFont("courier", "italic");
    doc.text("Contratada: Leila Tatiane", 20, yPos);
    doc.line(20, yPos + 5, 150, yPos + 5);
  
    // Exportar o PDF para um Blob
    const pdfBlob = doc.output('blob');
    
    // Retorna o Blob para ser utilizado na próxima função
    return pdfBlob;
  };
  
  // Função para envio do PDF pelo WhatsApp
  const enviarWhatsApp = (numeroTelefone) => {
    const pdfBlob = gerarPDF();
  
    // Criação de um link para download temporário do arquivo
    const pdfUrl = URL.createObjectURL(pdfBlob);
  
    // Número do WhatsApp e mensagem
    const mensagem = `Olá, Acabo de assinar o contrato de matrícula.`;
    const whatsappLink = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`;
  
    // Abrir o link do WhatsApp
    window.open(whatsappLink, '_blank');
  
    // Simula o download do PDF automaticamente (pois o WhatsApp web não permite anexos diretos sem interação)
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'contrato_matricula.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Função para envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    const numeroTelefone = '5591988074549'; // Número do WhatsApp com código do país (55) e DDD
    enviarWhatsApp(numeroTelefone);
  };
  
  return (
    <div className="home">
      <div className="homepagetitle">
        <h1>
          <span className="word">Contrato</span>
          <span className="word">De</span>
          <span className="word">Matrícula</span>
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="formulario">
          {/* Identificação do Aluno */}
          <div className="identificacao_aluno">
            <h2>Identificação Aluno</h2>

            <label htmlFor="nomealuno">Nome do aluno(a):</label>
            <input
              type="text"
              id="nomealuno"
              name="nomealuno"
              value={formValues.nomealuno}
              onChange={handleChange}
            />

            <label htmlFor="datanasc">Data de Nascimento:</label>
            <input
              type="date"
              id="datanasc"
              name="datanasc"
              value={formValues.datanasc}
              onChange={handleChange}
            />

            <label>Sexo:</label>
            <div className="radio-group">
              <input
                type="radio"
                name="genero"
                value="masculino"
                id="masculino"
                checked={formValues.genero === "masculino"}
                onChange={handleChange}
              />
              <label htmlFor="masculino">Masculino</label>

              <input
                type="radio"
                name="genero"
                value="feminino"
                id="feminino"
                checked={formValues.genero === "feminino"}
                onChange={handleChange}
              />
              <label htmlFor="feminino">Feminino</label>
            </div>

            <label htmlFor="idade">Idade:</label>
            <input
              type="number"
              id="idade"
              name="idade"
              value={formValues.idade}
              onChange={handleChange}
            />

            <label htmlFor="escola">Escola:</label>
            <input
              type="text"
              id="escola"
              name="escola"
              value={formValues.escola}
              onChange={handleChange}
            />

            <label htmlFor="serie">Série:</label>
            <input
              type="text"
              id="serie"
              name="serie"
              value={formValues.serie}
              onChange={handleChange}
            />

            <label htmlFor="endereco">Endereço:</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formValues.endereco}
              onChange={handleChange}
            />

            <label htmlFor="bairro">Bairro:</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formValues.bairro}
              onChange={handleChange}
            />
          </div>


          {/* Identificação do Responsável */}
          <div className="identificacao_responsavel">
            <h2>Identificação Responsável</h2>

            <label htmlFor="nomeresp">Nome do responsável:</label>
            <input
              type="text"
              id="nomeresp"
              name="nomeresp"
              value={formValues.nomeresp}
              onChange={handleChange}
            />

            <label htmlFor="ocupacao">Ocupação:</label>
            <input
              type="text"
              id="ocupacao"
              name="ocupacao"
              value={formValues.ocupacao}
              onChange={handleChange}
            />

            <label htmlFor="contato">Contato:</label>
            <input
              type="number"
              id="contato"
              name="contato"
              value={formValues.contato}
              onChange={handleChange}
            />
          </div>

          <div className="informacoes_reforco" id="informacoes_reforco">
            <h2>Informações do Reforço</h2>

            <label htmlFor="dias">Dias de aula:</label>
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="dias"
            value="segunda"
            id="segunda"
            checked={formValues.dias.includes('segunda')}
            onChange={handleChange}
          />
          <label htmlFor="segunda">Segunda</label>

          <input
            type="checkbox"
            name="dias"
            value="terca"
            id="terca"
            checked={formValues.dias.includes('terca')}
            onChange={handleChange}
          />
          <label htmlFor="terca">Terça</label>

          <input
            type="checkbox"
            name="dias"
            value="quarta"
            id="quarta"
            checked={formValues.dias.includes('quarta')}
            onChange={handleChange}
          />
          <label htmlFor="quarta">Quarta</label>

          <input
            type="checkbox"
            name="dias"
            value="quinta"
            id="quinta"
            checked={formValues.dias.includes('quinta')}
            onChange={handleChange}
          />
          <label htmlFor="quinta">Quinta</label>
        </div>



            <label htmlFor="hora">Horário de aula:</label>
            <div className="time-group">
              <label htmlFor="hora">Entrada:</label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={formValues.hora}
                onChange={handleChange}
              />

              <label htmlFor="hora_final">Saída:</label>
              <input
                type="time"
                id="hora_final"
                name="hora_final"
                value={formValues.hora_final}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mensalidade */}
          <div className="mensalidade">
            <h2>Mensalidade</h2>

            <label htmlFor="mensalidade">A mensalidade estabelecida inicialmente se mantém fixa de:</label>
            <input
              type="date"
              id="mensalidade"
              name="mensalidade"
              value={formValues.mensalidade}
              onChange={handleChange}
            />

            <label htmlFor="data_inicio">até:</label>
            <input
              type="date"
              id="data_inicio"
              name="data_inicio"
              value={formValues.data_inicio}
              onChange={handleChange}
            />
          </div>


          {/* Data de Vencimento */}
          <div className="vencimento">
            <h2>Data de vencimento</h2>
            <p>As mensalidades devem ser pagas até a data combinada e agendada previamente.</p>
          </div>

          {/* Feriados */}
          <div className="feriados">
            <h2>Feriados</h2>
            <p>Seguimos os mesmos feriados escolares.</p>
          </div>

          {/* Período de Recesso */}
          <div className="recesso">
            <h2>Período de Recesso</h2>
            <p>Mês de julho: Atendimento somente pelo período da manhã.</p>
            <p>
              Mês de Dezembro: Atendimento até o dia 20 do mês, caso o aluno
              necessite de apoio para as avaliações finais seguimos os atendimentos nesse período.
            </p>
          </div>

          {/* Observações */}
          <div className="obs">
            <p>
              Obs: Atividades interdisciplinares, não se encaixam como reforço escolar! (Caso esse
              serviço seja solicitado será cobrado valor fora parte).
            </p>
            <p>
              Obs: Autorização da imagem permitida para divulgar a imagem do meu filho nas redes
              sociais do reforço escolar.
            </p>
          </div>

          {/* Assinaturas */}
          <div className="assinaturas">
            <p>Contratante: _________________________________________</p>

            <label style={{ color: "#4CAF50" }} htmlFor="data_assinatura">
              Data da Assinatura:
            </label>
            <input
              type="date"
              id="data_assinatura"
              name="data_assinatura"
              value={formValues.data_assinatura}
              onChange={handleChange}
            />
          </div>


          {/* Botão de Salvar */}
          <div className="botaosalvar">
            <button type="submit">Salvar e Gerar PDF</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
