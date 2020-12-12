import React, {Component, createContext} from "react";
import {UserContext} from "./UserProvider";

let english = "EN";
let spanish = "SP";

export const LanguageContext = createContext({user: null, totals: null, monthTotals: null, sales: null, level: null, target: null, monthTargets: null});
class LanguageProvider extends Component {

    static contextType = LanguageContext;
    state = {language: english, labels: null};



    componentDidMount() {
        let labels = {};

        labels["greeting"] = {english: "Hello", spanish: "Hola"};
        labels["loginTitle"] = {english: "Login", spanish: "Iniciar Sesión"};
        labels["emailInput"] = {english: "Email", spanish: "Correo Electrónico"};
        labels["passwordInput"] = {english: "Password", spanish: "Contraseña"};
        labels["loginButton"] = {english: "Login", spanish: "Iniciar Sesión"};
        labels["signupPrompt"]= {english: "No Account?", spanish: "¿Sin Cuenta?"};
        labels["signupButton"] = {english: "Sign Up", spanish: "Regístrate"};
        labels["monthLabel"] = {english: "Sales for last 30 days", spanish: "Ventas de los 30 días pasados"};
        labels["allTimeLabel"] = {english: "All-time Sales", spanish: "Ventas Totales"};
        labels['item'] = {english: "Item", spanish: "Artículo"};
        labels['sold'] = {english: "Sold", spanish: "Ventas"};
        labels['goal'] = {english: "Goal", spanish: "Meta"};
        labels['home'] = {english: "Home", spanish: "Inicio"};
        labels['sales'] = {english: "Sales", spanish: "Ventas"};

        labels['all'] = {english: "All", spanish: "Todo"};
        labels['lastMonth'] = {english: "Last Month", spanish: "El Mes Pasado "};
        labels['sales'] = {english: "Sales", spanish: "Ventas"};
        labels['sales'] = {english: "Sales", spanish: "Ventas"};



        labels["signupTitle"] = {english: "Sign up", spanish: "Regístrate"};
        labels["nameInput"] = {english: "Name", spanish: "Nombre"};
        labels["loginPrompt"]= {english: "Have an Account?", spanish: "¿Tienes una cuenta?"};

        labels['clientTitle'] = {english: "Client", spanish: "Cliente"};
        labels['createdOn'] = {english: "Created on", spanish: "Fecha de Creación"};
        labels['complete'] = {english: "Completed", spanish: "Cancelado"};
        labels['notComplete'] = {english: "Not Completed", spanish: "No Cancelado"};
        labels['completed'] = {english: "Completed", spanish: "Finalizado"};
        labels['notCompleted'] = {english: "Not Completed", spanish: "No Finalizado"};

        labels['productPrompt'] = {english: "Order Quantity", spanish: "Pedido"};
        labels['smallSolarName'] = {english: "10W Kit", spanish: "10W Kit"};
        labels['largeSolarName'] = {english: "30W Kit", spanish: "30W Kit"};
        labels['filterName'] = {english: "Filter", spanish: "Filtro"};
        labels['prefilterName'] = {english: "Prefilter", spanish: "Prefiltro"};
        labels['stoveName'] = {english: "Stove", spanish: "Estufa"};

        labels['10W panel'] = {english: "10W Kit", spanish: "10W Kit"};
        labels['30W panel'] = {english: "30W Kit", spanish: "30W Kit"};
        labels['filter'] = {english: "Filter", spanish: "Filtro"};
        labels['prefilter'] = {english: "Prefilter", spanish: "Prefiltro"};
        labels['estufa'] = {english: "Stove", spanish: "Estufa"};
        labels['total'] = {english: "Total", spanish: "Todas"};


        labels['mapInstructions'] = {english: "Press and hold pin marker to move.", spanish: "Mantén pulsado el marcador para moverse"};
        labels['next'] = {english: "Next", spanish: "Siguiente"};

        labels['surveyTitle'] = {english: "Client Survey", spanish: "Encuesta de Cliente"};
        labels['surveyFinish'] = {english: "Finish Up", spanish: "Terminar"};

        labels['status'] = {english: "Status", spanish: "Estado"};
        labels['price'] = {english: "Price", spanish: "Precio"};
        labels['owed'] = {english: "Owed", spanish: "Debido"};
        labels['commission'] = {english: "Commission", spanish: "Comisión"};
        labels['items'] = {english: "Items", spanish: "Artículos"};
        labels['quantity'] = {english: "Quantity", spanish: "Cantidad"};
        labels['surveySection'] = {english: "Surveys", spanish: "Encuestas"};
        labels['pos'] = {english: "Point of Sale", spanish: "Punto de Venta"};
        labels['fu'] = {english: "Follow Up", spanish: "Seguimiento"};
        labels['photos'] = {english: "Photos", spanish: "Fotos"};

        labels['addPhoto'] = {english: "Add Image", spanish: "Agregar Imagen"};
        labels['takePhoto'] = {english: "Take a Picture", spanish: "Sacar una Foto"};
        labels['uploadPhoto'] = {english: "Upload Image", spanish: "Subir Imagen"};
        labels['completeCommand'] = {english: "Complete", spanish: "Cancelar"};
        labels['delete'] = {english: "Delete", spanish: "Eliminar"};

        labels['completeInstructions'] = {english: "Submit a photo of the deposit receipt here.", spanish: "Entregar una foto del recibo de depósito aquí."};

        labels['signOut'] = {english: "Sign Out", spanish: "Desconectar"};
        labels['sureSignOut'] = {english: "Are you sure you want to sign out?", spanish: "¿Estás segura de que quieres cerrar sesión?"};
        labels['cancel'] = {english: "Cancel", spanish: "Anular"};

        labels['sure'] = {english: "Are you sure?", spanish: "¿Estás segura de que quieres eliminar esta venta?"};
        labels['deleteSale'] = {english: "Delete Sale", spanish: "Eliminar Venta"};



        let englishLabels = {};
        Object.entries(labels).map(label => {englishLabels[label[0]]  = label[1]['english']});
        let spanishLabels = {};
        Object.entries(labels).map(label => {spanishLabels[label[0]]  = label[1]['spanish']});
        this.setState({labels: spanishLabels})

    }

    render() {return(
        <LanguageContext.Provider value={this.state}>
            {this.props.children}
        </LanguageContext.Provider>
    )
    }

}

export default LanguageProvider