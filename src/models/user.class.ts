export class User {
    firstName: string;
    lastName: string;
    email:string;
    birthDate: number;
    street: string;
    zipCode: number;
    city: string;
    phone: string;
    department: string;
    customers:Array<string>;

    constructor(obj?: any) {
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.birthDate = obj ? obj.birthDate : '';
        this.street = obj ? obj.street : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.phone = obj ? obj.phone : '';
        this.department = obj ? obj.department : '';
        this.customers = obj ? obj.customers : [];
    }

    public toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            birthDate: this.birthDate,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city,
            phone: this.phone,
            department: this.department,
            customers: this.customers
        }
    }
}

