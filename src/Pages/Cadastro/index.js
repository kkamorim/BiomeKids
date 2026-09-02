import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// ════════════════════════════════════════════════════════════════════
// Funções de Máscara
// ════════════════════════════════════════════════════════════════════

/** Formata data para DD/MM/AAAA enquanto digita */
function formatBirthDate(value) {
  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Formata CEP para 00000-000 enquanto digita */
function formatCep(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** Valida se a data DD/MM/AAAA é plausível */
function isValidDate(dateStr) {
  if (!dateStr || dateStr.length !== 10) return false;
  const [dd, mm, yyyy] = dateStr.split('/').map(Number);
  if (!dd || !mm || !yyyy) return false;
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  if (yyyy < 1900 || yyyy > new Date().getFullYear()) return false;
  // Verifica se o dia existe no mês
  const date = new Date(yyyy, mm - 1, dd);
  return date.getFullYear() === yyyy && date.getMonth() === mm - 1 && date.getDate() === dd;
}

/** Converte DD/MM/AAAA → YYYY-MM-DD para envio ao backend */
function convertDateToISO(dateStr) {
  const [dd, mm, yyyy] = dateStr.split('/');
  return `${yyyy}-${mm}-${dd}`;
}

/** Valida formato de email */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ════════════════════════════════════════════════════════════════════
// Componente Principal
// ════════════════════════════════════════════════════════════════════

export default function Conta() {
  const navigation = useNavigation();
  const { register } = useAuth();

  // Estados dos campos
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // ── Handler da Data de Nascimento ──
  const handleBirthDateChange = (text) => {
    setBirthDate(formatBirthDate(text));
  };

  // ── Handler do CEP com busca ViaCEP ──
  const handleCepChange = useCallback(async (text) => {
    const formatted = formatCep(text);
    setCep(formatted);

    const digits = text.replace(/\D/g, '');
    if (digits.length === 8) {
      setIsCepLoading(true);
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${digits}/json/`);
        if (response.data && !response.data.erro) {
          setCidade(response.data.localidade || '');
          setUf(response.data.uf || '');
        } else {
          setCidade('');
          setUf('');
          Alert.alert('CEP Inválido', 'O CEP informado não foi encontrado. Verifique e tente novamente.');
        }
      } catch (error) {
        setCidade('');
        setUf('');
        Alert.alert('Erro na Busca', 'Não foi possível buscar o CEP. Verifique sua conexão.');
      } finally {
        setIsCepLoading(false);
      }
    } else {
      setCidade('');
      setUf('');
    }
  }, []);

  // ── Validação e Registro ──
  const handleRegister = async () => {
    // Validações
    if (!fullName.trim() || fullName.trim().length < 3) {
      Alert.alert('Nome Inválido', 'Por favor, informe seu nome completo (mínimo 3 caracteres).');
      return;
    }

    if (!birthDate || !isValidDate(birthDate)) {
      Alert.alert('Data Inválida', 'Por favor, informe uma data de nascimento válida no formato DD/MM/AAAA.');
      return;
    }

    const cepDigits = cep.replace(/\D/g, '');
    if (!cepDigits || cepDigits.length !== 8) {
      Alert.alert('CEP Inválido', 'Por favor, informe um CEP válido com 8 dígitos.');
      return;
    }

    if (!email.trim() || !isValidEmail(email.trim())) {
      Alert.alert('Email Inválido', 'Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Senha Curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas Diferentes', 'A confirmação de senha não coincide com a senha informada.');
      return;
    }

    if (!lgpdConsent) {
      Alert.alert(
        'Termos Obrigatórios',
        'É necessário ler e aceitar os Termos de Uso e Política de Privacidade para criar sua conta.'
      );
      return;
    }

    setIsLoading(true);

    const result = await register({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      birthDate: convertDateToISO(birthDate),
      cep: cepDigits,
      lgpdConsent: true,
      termsVersion: '1.0',
    });

    setIsLoading(false);

    if (result.success) {
      navigation.replace('Territorio');
    } else {
      Alert.alert('Erro no Cadastro', result.error);
    }
  };

  // ════════════════════════════════════════════════════════════════════
  // Render
  // ════════════════════════════════════════════════════════════════════
  return (
    <ImageBackground
      style={styles.container}
      source={require('../../../assets/fundo-selva.png')}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Placa BiomeKids ── */}
          <View style={styles.placaContainer}>
            <Image
              style={styles.placa}
              source={require('../../../assets/placa-biomekids.png')}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.tittle}>
            Crie sua conta de escoteiro e comece sua expedição pelos biomas!
          </Text>

          {/* ── Formulário ── */}
          <View style={styles.form}>

            {/* Nome Completo */}
            <Text style={styles.text}>
              <Ionicons name="person-outline" size={18} color="#42240c" /> Nome Completo:
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            {/* Data de Nascimento */}
            <Text style={styles.text}>
              <Ionicons name="calendar-outline" size={18} color="#42240c" /> Data de Nascimento:
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#666"
                value={birthDate}
                onChangeText={handleBirthDateChange}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* CEP */}
            <Text style={styles.text}>
              <Ionicons name="location-outline" size={18} color="#42240c" /> CEP:
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="00000-000"
                placeholderTextColor="#666"
                value={cep}
                onChangeText={handleCepChange}
                keyboardType="numeric"
                maxLength={9}
              />
              {isCepLoading && (
                <ActivityIndicator size="small" color="#47a51b" style={styles.cepLoading} />
              )}
            </View>

            {/* Cidade / UF — lado a lado */}
            <View style={styles.rowContainer}>
              <View style={styles.rowItem}>
                <Text style={styles.rowLabel}>
                  <Ionicons name="business-outline" size={16} color="#42240c" /> Cidade:
                </Text>
                <View style={styles.rowInputDisabled}>
                  <TextInput
                    style={{ flex: 1, color: cidade ? '#333' : '#999' }}
                    placeholder="Automático"
                    placeholderTextColor="#999"
                    value={cidade}
                    editable={false}
                  />
                </View>
              </View>
              <View style={{ width: 80 }}>
                <Text style={styles.rowLabel}>
                  <Ionicons name="map-outline" size={16} color="#42240c" /> UF:
                </Text>
                <View style={styles.rowInputDisabled}>
                  <TextInput
                    style={{ flex: 1, color: uf ? '#333' : '#999', textAlign: 'center' }}
                    placeholder="UF"
                    placeholderTextColor="#999"
                    value={uf}
                    editable={false}
                  />
                </View>
              </View>
            </View>

            {/* Email */}
            <Text style={styles.text}>
              <Ionicons name="mail-outline" size={18} color="#42240c" /> Email:
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Digite seu email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Senha */}
            <Text style={styles.text}>
              <Ionicons name="lock-closed-outline" size={18} color="#42240c" /> Senha:
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  style={styles.icon}
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Confirmar Senha */}
            <Text style={styles.text}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#42240c" /> Confirmar Senha:
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={{ flex: 1 }}
                placeholder="Repita sua senha"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  style={styles.icon}
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* ── Checkbox LGPD ── */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setLgpdConsent(!lgpdConsent)}>
                <Ionicons
                  name={lgpdConsent ? "checkbox-outline" : "square-outline"}
                  size={26}
                  color={lgpdConsent ? "#47a51b" : "#666"}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                Li e aceito os{' '}
                <Text style={styles.linkText} onPress={() => setShowTermsModal(true)}>
                  Termos de Uso e Política de Privacidade
                </Text>
              </Text>
            </View>

            {/* ── Botão Criar Conta ── */}
            <Pressable
              style={isLoading ? styles.btnDisabled : styles.btn}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Criar Conta</Text>
              )}
            </Pressable>

            {/* ── Link para Login ── */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Entrar')}
            >
              <Text style={styles.loginLinkText}>
                Já tem uma conta?{' '}
                <Text style={styles.loginLinkBold}>Fazer Login</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODAL — Termos de Uso e Política de Privacidade             */}
      {/* ════════════════════════════════════════════════════════════ */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Termos de Uso e Política de Privacidade</Text>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => setShowTermsModal(false)}
              >
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Conteúdo scrollável */}
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
            >

              {/* ═══════════════════════════════════════════ */}
              {/*  TERMOS DE USO                              */}
              {/* ═══════════════════════════════════════════ */}

              <Text style={styles.modalSection}>📋 TERMOS DE USO</Text>
              <Text style={styles.modalText}>
                Última atualização: Setembro de 2026
              </Text>

              <Text style={styles.modalSubSection}>1. Aceitação dos Termos</Text>
              <Text style={styles.modalText}>
                Ao acessar, baixar ou utilizar o aplicativo BiomeKids/ZooKids ("Aplicativo"), você declara ter lido, 
                compreendido e concordado integralmente com estes Termos de Uso. Caso não concorde com qualquer 
                disposição aqui prevista, não utilize o Aplicativo. O uso continuado do Aplicativo após eventuais 
                alterações nestes Termos constitui aceitação das modificações.
              </Text>

              <Text style={styles.modalSubSection}>2. Descrição do Serviço</Text>
              <Text style={styles.modalText}>
                O BiomeKids/ZooKids é um aplicativo educativo voltado ao público infantil e juvenil, cujo objetivo é 
                promover o aprendizado sobre biomas, ecossistemas e espécies animais por meio de atividades interativas, 
                gamificação e conteúdo pedagógico. O Aplicativo não substitui o ensino formal e tem caráter complementar 
                e recreativo.
              </Text>

              <Text style={styles.modalSubSection}>3. Elegibilidade e Cadastro</Text>
              <Text style={styles.modalText}>
                Para utilizar o Aplicativo, é necessário realizar cadastro fornecendo informações verídicas e 
                atualizadas. Menores de 18 (dezoito) anos devem ter autorização de seu responsável legal para 
                cadastro e uso do Aplicativo, conforme o Art. 14 da Lei Geral de Proteção de Dados (LGPD) e o 
                Estatuto da Criança e do Adolescente (ECA — Lei nº 8.069/1990). O usuário é integralmente 
                responsável por manter a confidencialidade de suas credenciais de acesso (e-mail e senha).
              </Text>

              <Text style={styles.modalSubSection}>4. Uso Aceitável</Text>
              <Text style={styles.modalText}>
                O usuário compromete-se a utilizar o Aplicativo de forma ética, legal e em conformidade com estes 
                Termos. É expressamente proibido:{'\n'}
                • Utilizar o Aplicativo para fins ilícitos, fraudulentos ou não autorizados;{'\n'}
                • Tentar acessar áreas restritas, manipular dados ou comprometer a segurança do sistema;{'\n'}
                • Reproduzir, copiar, distribuir ou modificar o conteúdo do Aplicativo sem autorização prévia;{'\n'}
                • Compartilhar credenciais de acesso com terceiros;{'\n'}
                • Inserir conteúdo ofensivo, discriminatório, difamatório ou que viole direitos de terceiros;{'\n'}
                • Utilizar robôs, scrapers ou qualquer meio automatizado para acessar o Aplicativo.
              </Text>

              <Text style={styles.modalSubSection}>5. Propriedade Intelectual</Text>
              <Text style={styles.modalText}>
                Todo o conteúdo disponível no Aplicativo — incluindo, mas não se limitando a, textos, imagens, 
                ilustrações, ícones, logotipos, marcas (BiomeKids™, ZooKids™), sons, código-fonte e design de 
                interface — é de propriedade exclusiva da empresa desenvolvedora ou de seus licenciadores, 
                protegido pela legislação brasileira de direitos autorais (Lei nº 9.610/1998) e propriedade 
                industrial (Lei nº 9.279/1996). É vedada qualquer reprodução, total ou parcial, sem autorização 
                expressa e por escrito.
              </Text>

              <Text style={styles.modalSubSection}>6. Limitação de Responsabilidade</Text>
              <Text style={styles.modalText}>
                A empresa desenvolvedora NÃO se responsabiliza por:{'\n'}
                • Ações, decisões ou comportamentos do usuário fora do ambiente do Aplicativo;{'\n'}
                • Danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou 
                  impossibilidade de uso do Aplicativo;{'\n'}
                • Conteúdo gerado, compartilhado ou interpretado por terceiros;{'\n'}
                • Falhas técnicas, interrupções de serviço, ataques cibernéticos ou eventos de força maior 
                  que possam afetar a disponibilidade do Aplicativo;{'\n'}
                • Interações entre usuários fora do Aplicativo;{'\n'}
                • Uso indevido das informações educativas fornecidas como se fossem aconselhamento profissional;{'\n'}
                • Quaisquer perdas ou danos resultantes de acesso não autorizado à conta do usuário por falha 
                  em manter a segurança de suas credenciais.
              </Text>

              <Text style={styles.modalSubSection}>7. Isenção de Garantias</Text>
              <Text style={styles.modalText}>
                O Aplicativo é fornecido "como está" ("as is") e "conforme disponível" ("as available"), sem 
                garantias de qualquer natureza, expressas ou implícitas, incluindo, mas não se limitando a, 
                garantias de comercialização, adequação a um fim particular, continuidade ou ausência de erros. 
                A empresa desenvolvedora envidará esforços razoáveis para manter o Aplicativo funcional e 
                atualizado, mas não garante disponibilidade ininterrupta.
              </Text>

              <Text style={styles.modalSubSection}>8. Modificações nos Termos</Text>
              <Text style={styles.modalText}>
                A empresa desenvolvedora reserva-se o direito de alterar estes Termos de Uso a qualquer momento, 
                mediante notificação prévia por meio do Aplicativo ou por e-mail. A continuidade do uso após a 
                notificação será considerada como aceitação dos novos termos. Em caso de alterações substanciais, 
                poderá ser solicitado novo consentimento expresso.
              </Text>

              <Text style={styles.modalSubSection}>9. Suspensão e Rescisão</Text>
              <Text style={styles.modalText}>
                A empresa desenvolvedora poderá, a seu exclusivo critério, suspender ou encerrar a conta de 
                qualquer usuário que viole estes Termos, sem necessidade de aviso prévio e sem prejuízo de 
                outras medidas cabíveis. O usuário pode solicitar a exclusão de sua conta a qualquer momento, 
                conforme descrito na Política de Privacidade.
              </Text>

              <Text style={styles.modalSubSection}>10. Legislação Aplicável e Foro</Text>
              <Text style={styles.modalText}>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer 
                controvérsias decorrentes destes Termos, fica eleito o foro da Comarca do domicílio do usuário, 
                conforme previsto no Código de Defesa do Consumidor (Lei nº 8.078/1990, Art. 101, I).
              </Text>

              <View style={styles.modalDivider} />

              {/* ═══════════════════════════════════════════ */}
              {/*  POLÍTICA DE PRIVACIDADE (LGPD)             */}
              {/* ═══════════════════════════════════════════ */}

              <Text style={styles.modalSection}>🔒 POLÍTICA DE PRIVACIDADE</Text>
              <Text style={styles.modalText}>
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados 
                pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018) 
                e demais legislações aplicáveis.
              </Text>

              <Text style={styles.modalSubSection}>1. Dados Pessoais Coletados</Text>
              <Text style={styles.modalText}>
                Coletamos os seguintes dados pessoais durante o cadastro e uso do Aplicativo:{'\n'}
                • Nome completo;{'\n'}
                • Endereço de e-mail;{'\n'}
                • Data de nascimento;{'\n'}
                • CEP (Código de Endereçamento Postal);{'\n'}
                • Cidade e Estado (obtidos automaticamente via CEP);{'\n'}
                • Dados de uso e navegação dentro do Aplicativo (progresso, conquistas, interações);{'\n'}
                • Informações técnicas do dispositivo (modelo, sistema operacional, versão do app).
              </Text>

              <Text style={styles.modalSubSection}>2. Base Legal para o Tratamento</Text>
              <Text style={styles.modalText}>
                O tratamento dos seus dados pessoais é realizado com base nas seguintes hipóteses legais 
                previstas no Art. 7º da LGPD:{'\n'}
                • Consentimento do titular (Art. 7º, I) — fornecido no momento do cadastro;{'\n'}
                • Execução de contrato (Art. 7º, V) — necessário para prestação do serviço;{'\n'}
                • Legítimo interesse do controlador (Art. 7º, IX) — para melhorias do serviço e segurança.
              </Text>

              <Text style={styles.modalSubSection}>3. Finalidade do Tratamento</Text>
              <Text style={styles.modalText}>
                Seus dados pessoais são tratados para as seguintes finalidades:{'\n'}
                • Criação e gerenciamento de sua conta;{'\n'}
                • Personalização da experiência educativa;{'\n'}
                • Comunicação sobre atualizações, novidades e suporte;{'\n'}
                • Análise estatística e melhoria contínua do Aplicativo;{'\n'}
                • Cumprimento de obrigações legais e regulatórias;{'\n'}
                • Prevenção de fraudes e segurança do sistema.
              </Text>

              <Text style={styles.modalSubSection}>4. Compartilhamento de Dados</Text>
              <Text style={styles.modalText}>
                Seus dados pessoais NÃO serão vendidos, alugados ou cedidos a terceiros para fins comerciais. 
                O compartilhamento poderá ocorrer exclusivamente nas seguintes hipóteses:{'\n'}
                • Com prestadores de serviços essenciais (hospedagem, infraestrutura) que atuam como operadores, 
                  sob obrigações contratuais de confidencialidade e segurança;{'\n'}
                • Por determinação legal, judicial ou de autoridade competente;{'\n'}
                • Para proteção dos direitos, propriedade ou segurança da empresa, dos usuários ou de terceiros.
              </Text>

              <Text style={styles.modalSubSection}>5. Armazenamento e Segurança</Text>
              <Text style={styles.modalText}>
                Seus dados são armazenados em servidores seguros, protegidos por medidas técnicas e 
                administrativas adequadas, incluindo:{'\n'}
                • Criptografia de dados em trânsito (HTTPS/TLS) e em repouso;{'\n'}
                • Controle de acesso restrito com autenticação multifator;{'\n'}
                • Monitoramento contínuo contra acessos não autorizados;{'\n'}
                • Backups regulares e plano de recuperação de desastres.{'\n\n'}
                Os dados serão mantidos pelo período necessário ao cumprimento das finalidades descritas ou 
                conforme exigido por obrigação legal. Após o término do tratamento, os dados serão eliminados 
                de forma segura, salvo obrigação legal de retenção.
              </Text>

              <Text style={styles.modalSubSection}>6. Direitos do Titular dos Dados (Art. 18 — LGPD)</Text>
              <Text style={styles.modalText}>
                Você, como titular dos dados, tem direito a:{'\n'}
                • Confirmação da existência de tratamento de seus dados;{'\n'}
                • Acesso aos dados pessoais coletados;{'\n'}
                • Correção de dados incompletos, inexatos ou desatualizados;{'\n'}
                • Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;{'\n'}
                • Portabilidade dos dados a outro fornecedor de serviço;{'\n'}
                • Eliminação dos dados pessoais tratados com consentimento;{'\n'}
                • Informação sobre entidades com as quais seus dados foram compartilhados;{'\n'}
                • Informação sobre a possibilidade de não fornecer consentimento e suas consequências;{'\n'}
                • Revogação do consentimento a qualquer momento.{'\n\n'}
                Para exercer seus direitos, entre em contato pelo canal indicado na seção "Contato" abaixo.
              </Text>

              <Text style={styles.modalSubSection}>7. Dados de Crianças e Adolescentes</Text>
              <Text style={styles.modalText}>
                Em conformidade com o Art. 14 da LGPD e o Estatuto da Criança e do Adolescente (ECA), o tratamento 
                de dados pessoais de crianças (menores de 12 anos) somente será realizado com consentimento 
                específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal. Para adolescentes 
                (entre 12 e 18 anos), o tratamento observará o seu melhor interesse, conforme legislação aplicável. 
                A empresa envidará esforços razoáveis para verificar que o consentimento foi dado pelo responsável 
                legal, utilizando tecnologias disponíveis.
              </Text>

              <Text style={styles.modalSubSection}>8. Cookies e Tecnologias de Rastreamento</Text>
              <Text style={styles.modalText}>
                O Aplicativo pode utilizar tecnologias de rastreamento (analytics, logs de uso) exclusivamente para 
                fins de melhoria da experiência do usuário e análise de desempenho. Nenhuma tecnologia invasiva 
                de rastreamento é empregada e os dados coletados são anonimizados sempre que possível.
              </Text>

              <Text style={styles.modalSubSection}>9. Transferência Internacional de Dados</Text>
              <Text style={styles.modalText}>
                Caso seus dados sejam armazenados ou processados em servidores localizados fora do Brasil, a 
                transferência será realizada em conformidade com os Art. 33 a 36 da LGPD, garantindo nível 
                adequado de proteção de dados pessoais.
              </Text>

              <View style={styles.modalDivider} />

              {/* ═══════════════════════════════════════════ */}
              {/*  DEFESA DO CONSUMIDOR                       */}
              {/* ═══════════════════════════════════════════ */}

              <Text style={styles.modalSection}>⚖️ DIREITOS DO CONSUMIDOR</Text>
              <Text style={styles.modalText}>
                Em conformidade com o Código de Defesa do Consumidor (CDC — Lei nº 8.078/1990):
              </Text>

              <Text style={styles.modalSubSection}>Direito à Informação</Text>
              <Text style={styles.modalText}>
                Disponibilizamos informações claras, precisas e acessíveis sobre os serviços oferecidos, 
                suas características, funcionalidades e eventuais limitações, conforme Art. 6º, III do CDC.
              </Text>

              <Text style={styles.modalSubSection}>Proteção contra Práticas Abusivas</Text>
              <Text style={styles.modalText}>
                Nos comprometemos a não adotar práticas consideradas abusivas pelo CDC, incluindo publicidade 
                enganosa ou abusiva, especialmente voltada ao público infantil, em observância ao Art. 37 do CDC 
                e à Resolução nº 163/2014 do CONANDA.
              </Text>

              <Text style={styles.modalSubSection}>Canais de Atendimento</Text>
              <Text style={styles.modalText}>
                Mantemos canais de atendimento acessíveis para dúvidas, reclamações e exercício de direitos. 
                Em caso de problemas não resolvidos, o usuário pode recorrer aos órgãos de defesa do consumidor 
                (PROCON) ou à plataforma consumidor.gov.br.
              </Text>

              <View style={styles.modalDivider} />

              {/* ═══════════════════════════════════════════ */}
              {/*  CONTATO                                    */}
              {/* ═══════════════════════════════════════════ */}

              <Text style={styles.modalSection}>📬 CONTATO</Text>
              <Text style={styles.modalText}>
                Para exercer seus direitos, esclarecer dúvidas ou reportar incidentes relacionados à privacidade 
                e proteção de dados, entre em contato com nosso Encarregado de Proteção de Dados (DPO):{'\n\n'}
                📧 E-mail: BiomeKidsContato@gmail.com{'\n'}
                🏢 Empresa: BiomeKids{'\n'}
                📍 Endereço: Brasil - SP - São Paulo{'\n\n'}
                Responderemos sua solicitação no prazo de até 15 (quinze) dias úteis, conforme previsto na LGPD.
              </Text>

              <View style={styles.modalDivider} />

              <Text style={[styles.modalText, { textAlign: 'center', fontStyle: 'italic', color: '#888' }]}>
                Ao criar sua conta, você confirma que leu, compreendeu e concorda com todos os termos 
                e políticas acima descritos.
              </Text>

            </ScrollView>

            {/* Footer com botão */}
            <View style={styles.modalFooter}>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => {
                  setLgpdConsent(true);
                  setShowTermsModal(false);
                }}
              >
                <Text style={styles.modalCloseBtnText}>Li e Aceito os Termos</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </ImageBackground>
  );
}
