export class DabbaService {
    constructor(serviceName, area) {
        // Your code here
        this.serviceName = serviceName;
        this.area = area;
        this.customers = [];
        this._nextId = 1;
    }

    addCustomer(name, address, mealPreference) {
        // Your code here
        const validPreferences = ["veg", "nonveg", "jain"];

        if (!validPreferences.includes(mealPreference)) return null;
        if (this.customers.some((c) => c.name === name)) return null;

        const newCustomer = {
            id: this._nextId++,
            name,
            address,
            mealPreference,
            active: true,
            delivered: false,
        };

        this.customers.push(newCustomer);
        return newCustomer;
    }

    removeCustomer(name) {
        // Your code here
        const customer = this.customers.find((c) => c.name === name);

        if (!customer || !customer.active) return false;

        customer.active = false;
        return true;
    }

    createDeliveryBatch() {
        // Your code here

        const activeOnes = this.customers.filter((c) => c.active);
        if (activeOnes.length === 0) return [];

        const batchTime = new Date().toISOString();

        return activeOnes.map((c) => {
            c.delivered = false;
            return {
                customerId: c.id,
                name: c.name,
                address: c.address,
                mealPreference: c.mealPreference,
                batchTime: batchTime,
            };
        });
    }

    markDelivered(customerId) {
        // Your code here
        const customer = this.customers.find(
            (c) => c.id === customerId && c.active,
        );

        if (!customer) return false;

        customer.delivered = true;
        return true;
    }

    getDailyReport() {
        // Your code here
        const activeCustomers = this.customers.filter((c) => c.active);

        const report = {
            totalCustomers: activeCustomers.length,
            delivered: activeCustomers.filter((c) => c.delivered).length,
            pending: activeCustomers.filter((c) => !c.delivered).length,
            mealBreakdown: { veg: 0, nonveg: 0, jain: 0 },
        };

        activeCustomers.forEach((c) => {
            report.mealBreakdown[c.mealPreference]++;
        });

        return report;
    }

    getCustomer(name) {
        // Your code here
        return this.customers.find((c) => c.name === name) || null;
    }
}