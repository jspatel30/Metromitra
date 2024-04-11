import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 20
    },
    container: {
        flexDirection: 'column',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#cccccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    logo: {
        height: 50,
    },
    address: {
        marginBottom: 10,
        fontSize: 10
    },
    invoiceHead: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    table: {
        marginBottom: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#cccccc',
        borderRadius: 5,
        fontSize: 10
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        padding: 5,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#cccccc',
        padding: 5,
    },
    tableCell: {
        flex: 1,
        padding: 5,
       
    },
    tableCellHeader: {
        fontWeight: 'bold',
    },
    invoiceThank: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
});

var Data = "";
var OrderListObj = Array();
var ServiceData = ""
var Total = 0;
const UserName = localStorage.getItem("UserName")
var order = ""

const DownloadInvoice = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null);
    
    
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/orderList/getOrderListByOrderId/${orderId}`);
            console.log("resppinse.......", response)
            setOrderData(response.data);
            Data = response.data;
            OrderListObj = response.data.orderList;
            ServiceData = response.data.order.Service
            order = response.data.order
            console.log(OrderListObj);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };
    useEffect(() => {
        fetchData();
        
    }, []);

    return (

        <PDFDownloadLink document={
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Image src="/assets/Metromitra_Logo.png" style={styles.logo} />
                            
                            {/* <Text style={styles.invoiceHead}>Invoice #2340</Text> */}
                        </View>
                        <View style={styles.address}>
                            <Text>Name:     {UserName}</Text>
                            <Text>Address:     {order.Address}</Text>
                            <Text>Area:      {ServiceData.Area}</Text>
                            <Text>City:      {ServiceData.City}</Text>
                        </View>
                        <View style={styles.address}>
                            <Text>Service Name: {ServiceData.ServiceName}</Text>
                            <Text>Service Provider: {Data.ServiceProviderName} </Text>
                            <Text>Visiting Fees: {ServiceData.Fees}</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Work</Text>
                                <Text style={styles.tableCell}>Amount</Text>
                            </View>
                            {OrderListObj.map((element, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={styles.tableCell}>{element.ItemName}</Text>
                                    <Text style={styles.tableCell}>{element.Price}</Text>
                                    {Total += parseInt(element.Price)} 
                                </View>

                            ))}
                        </View>
                        <Text style={styles.invoiceHead}>Total: {Total + ServiceData.Fees}</Text>
                        <Text style={styles.invoiceThank}>Thank You for Choosing Metromita!</Text>
                        <View style={styles.footer}>
                        </View>
                    </View>
                </Page>
            </Document>
        } fileName="invoice.pdf">
            {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink>
    );
};

export default DownloadInvoice;
