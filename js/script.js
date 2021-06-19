const Utils = {
    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    getYear(date) {
        const splittedDate = date.split("-");

        var d = new Date();
        ano_atual = d.getFullYear();
        mes_atual = d.getMonth() + 1;
        dia_atual = d.getDate();

        ano_aniversario = splittedDate[0];
        mes_aniversario = splittedDate[1];
        dia_aniversario = splittedDate[2];

        idade = ano_atual - ano_aniversario;

        if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
            idade--;
        }

        return idade;
    },

    legalAge(idade) {
        if (idade >= 18) {
            return "sim";
        } else {
            return "não";
        }
    }
};

const StorageDB = {

    get() {
        return JSON.parse(localStorage.getItem("picpay:dados")) || [];
    },

    set(dados) {
        localStorage.setItem("picpay:dados", JSON.stringify(dados));
    }
};

const DadosConfig = {
    all: StorageDB.get(),

    add(dados) {
        DadosConfig.all.push(dados);

        App.reload();
    },

    remove(index) {
        DadosConfig.all.splice(index, 1);

        App.reload();
    },
};

const DOM = {
    dadosContainer: document.querySelector("#data-table tbody"),

    addDados(dados, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerDados(dados, index);
        tr.dataset.index = index;

        DOM.dadosContainer.appendChild(tr);
    },

    innerDados(dados, index) {
        const date = Utils.formatDate(dados.date);

        const html = `
        <td>${dados.nome}</td>
        <td>${dados.sobrenome}</td>
        <td>${date}</td>
        <td>${dados.idade}</td>
        <td>${dados.maior}</td>
        <td>
            <img onclick="DadosConfig.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `;

        return html;
    },

    clearDados() {
        DOM.dadosContainer.innerHTML = "";
    }
};

const Form = {
    nome: document.querySelector("input#nome"),
    sobrenome: document.querySelector("input#sobrenome"),
    date: document.querySelector("input#date"),

    getValues() {
        return {
            nome: Form.nome.value,
            sobrenome: Form.sobrenome.value,
            date: Form.date.value
        };
    },

    validateFields() {
        const { nome, sobrenome, date } = Form.getValues();

        if (nome.trim() === "" ||
            sobrenome.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos");
        }
    },

    formatValues() {
        let { nome, sobrenome, date } = Form.getValues();

        var idade = Utils.getYear(date);
        var maior = Utils.legalAge(idade);

        return {
            nome,
            sobrenome,
            date,
            idade,
            maior
        };
    },

    clearFields() {
        Form.nome.value = "";
        Form.sobrenome.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateFields();
            const dados = Form.formatValues();
            DadosConfig.add(dados);
            Form.clearFields();
        } catch (error) {
            alert(error.message);
        }
    }
};

const App = {
    init() {
        DadosConfig.all.forEach(DOM.addDados);
        StorageDB.set(DadosConfig.all);
    },
    reload() {
        DOM.clearDados();
        App.init();
    },
};

App.init();