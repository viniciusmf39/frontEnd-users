const axios = require('axios').default;

class User{
    constructor() {
        this.name = document.getElementById('txtName');
        this.email = document.getElementById('txtEmail');
        this.age = document.getElementById('txtAge');
        this.phone = document.getElementById('txtPhone');
        this.btnRegisterUser = document.getElementById('btnRegister');
        this.btnUpdate = document.getElementById('btnUpdateUser');
        this.id = 0;        

        this.getUsers();
        this.events();
    }

    events() {
        this.btnRegisterUser.onclick = (event) => this.userValidate(event);
        this.btnUpdate.onclick = (event) => this.updateUser(this.id);
    }

    getUsers(){
        axios.get(`http://localhost:3000/users`)
            .then((response) => {
               this.recoveryUser(response.data.users)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getUser(id) {
        axios.get(`http://localhost:3000/users/${id}`)
        .then((response) => {     
            console.log(response.data);
            this.id = id;    
            document.getElementById('txtName').value = response.data.user[0].name;
            document.getElementById('txtAge').value = response.data.user[0].age;
            document.getElementById('txtPhone').value = response.data.user[0].phone;
            document.getElementById('txtEmail').value = response.data.user[0].email;      
            
        })
        .catch((error) => {
            console.log(error); 
        })
    }

    recoveryUser(data) {
        for(user of data) {
            const html = this.layoutUser(user.name, user.email, user.age, user.phone, user.id);
            this.insertHtml(html);
        }
        
        document.querySelectorAll('.deleteUser').forEach(button => {
            button.onclick = event => this.deleteUser(button.id);
        })

        document.querySelectorAll('.getUser').forEach(button => {
            button.onclick = event => this.getUser(button.id);
        })
    }

    layoutUser(name, email, age, phone,id) {
        return `
             <div class="col mt-5">
                 <div class="card">
                    <div class="userBody">
                         <h5 class="userName">${name}</h5>
                         <p class="userEmail">${email}</p>
                         <p class="userAge">${age}</p>
                         <p class="userPhone">${phone}</p>
                         <button type="button" class="btn btn-danger deleteUser" id="${id}">Excluir</button>
                         <button type="button" class="btn btn-outline-primary getUser" id="${id}" data-toggle="modal" data-target="#exampleModalEdit">Editar</button>
                    </div>
                    
                 </div>
             </div>
        `; 
    }

    userValidate(event) {
        event.preventDefault();
        if(this.name.value && this.email.value && this.age.value && this.phone.value){
            const user = {
                name: this.name.value,
                email: this.email.value,
                age: this.age.value,
                phone: this.phone.value
            }
            
            this.createUser(user);
        } else {
            alert('preencha todos os dados');
        }
    }

    insertHtml(html) {
        document.getElementById('usersBoard').innerHTML += html;
    }

    createUser(user) {
        axios.post(`http://localhost:3000/users`, user)
        .then((response) => {
            const html = this.layoutUser(user.name, user.email, user.age, user.phone);
            this.insertHtml(html);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteUser(id) {
        axios.delete(`http://localhost:3000/users/${id}`)
        .then((result) => {
            alert(result.data.result)
        })
        .catch((error) => {
            console.log(error)
        })
    }    

    updateUser(id){ 
        let user = {
            name: document.getElementById('txtName').value,
            age: document.getElementById('txtAge').value,
            phone: document.getElementById('txtPhone').value,
            email: document.getElementById('txtEmail').value
        }
        axios.put(`http://localhost:3000/users/${id}`, user)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }
}

new User(); 