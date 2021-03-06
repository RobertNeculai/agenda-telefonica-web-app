window.PhoneBook ={
    API_BASE_URL:"http://localhost:8081/contacts",
    getContacts: function () {
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            PhoneBook.displayContacts(JSON.parse(response));
        })
    },
    createContacts: function () {
        let firstNameValue=$("#first_name-field").val();
        let lastNameValue=$("#last_name-field").val();
        let phoneNumberValue=$("#phonenumber-field").val();
        let emailValue=$("#email-field").val();

        let requestBody={
            first_name: firstNameValue,
            last_name: lastNameValue,
            phonenumber: phoneNumberValue,
            email: emailValue
        };
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function (requestBody) {
            PhoneBook.getContacts();
        })
    },
    updateContactsPhoneNumber: function(id,phonenumber){
        let requestBody={
           phonenumber: phonenumber
        };
        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id="+id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            PhoneBook.getContacts();
        });
    },
    updateContactsEmail: function(id,email) {
        let requestBody = {
            email: email
        };
        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestBody)
        }).done(function () {
            PhoneBook.getContacts();
        });
    },
    deleteContacts: function(id) {
        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "DELETE",
        }).done(function () {
            PhoneBook.getContacts();
        });
    },
    getContactRow: function (contact) {

        return `<tr>
            <td> ${contact.last_name} </td>
            <td> ${contact.first_name} </td>
            <td> ${contact.phonenumber} </td>
            <td> ${contact.email} </td>
            <td><input type="button" value="Update Phone Number" data-id=${contact.id}  class="update-mark">
             <input type="button" value="Update Email" data-id=${contact.id}  class="email-mark"></td>
            <td><a href="#" data-id="${contact.id}" class="delete-contact"> <i class="fas fa-trash-alt"></i>
            </a> </td>
        </tr>`
    },
    displayContacts: function (contacts) {
        var tableBody = '';
        contacts.forEach(contact => tableBody+=PhoneBook.getContactRow(contact));
        $("#Contacts-table tbody").html(tableBody);
    },
    bindEvents:function (contact) {
        //capturing Submit-form event for function binding
        $("#new-contact-form").submit(function (event) {
            event.preventDefault();
            PhoneBook.createContacts();
        });
        $("#email-checkbox").change(function (event) {
            event.preventDefault();
            $(this).replaceWith($(`<input type="text" id="email-field" placeholder="Enter email adress">`));
        });
        $("#Contacts-table").delegate(".update-mark", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");
            $(this).replaceWith($(`<input type="tel" placeholder="Enter new Phone Number" data-id=${contactId} class="phonebook-update">`),
                `<input type="button" data-id=${contactId} value="Submit Changes" class="submit-mark">`);
        });
        $("#Contacts-table").delegate(".email-mark","click",function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");
            $(this).replaceWith($(`<input type="text" placeholder="Enter New Email Adress" data-id=${contactId} class="email-update">`),
                `<input type="button" data-id=${contactId} value="Submit Changes" class="submitemail-mark">`);
        });
        $("#Contacts-table").delegate(".submitemail-mark","click",function (event) {
            event.preventDefault();
            let contactId=$(this).data("id");
            let email=$(this).siblings(".email-update").val();
            if(email==null || email=="") {
                console.log("Cannot update with null value");
                $(this).siblings(".email-update").val("");
            }
            else
                PhoneBook.updateContactsEmail(contactId,email);

        });
        $("#Contacts-table").delegate(".submit-mark","click",function (event) {
            event.preventDefault();
            let contactId=$(this).data("id");
            let phonenumber = $(this).siblings(".phonebook-update").val();

            if(phonenumber==null || phonenumber=="" || !phonenumber?.match("(?=.*[0-9]).*"))
            {
                console.log("Cannot update with null or non-numeric value");
                $(this).siblings(".phonebook-update").val("");
            }
            else {
                PhoneBook.updateContactsPhoneNumber(contactId, phonenumber);
            }
        });
        $("#Contacts-table").delegate(".delete-contact", "click", function (event) {
            event.preventDefault();
            let contactId = $(this).data("id");
            PhoneBook.deleteContacts(contactId);
        });
    }
};
PhoneBook.getContacts();
PhoneBook.bindEvents();