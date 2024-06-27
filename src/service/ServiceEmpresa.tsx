export interface Empresas {
    id?: number;
    nombre: string;
    razonSocial: string;
    cuil: number;
  
}

export const getEmpresas = async (): Promise<Empresas[]> => {
    const endpoint = "http://localhost:8080/api/empresa/traer-todo/";
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
    });
    console.log(response);
    return await response.json();
};

export async function crearEmpresa(formData: Empresas) {
    console.log("estoy en el crearEmpresa");
    
    try {
        console.log("estoy en el fetch");

        console.log(formData);

        const urlServer = "http://localhost:8080/api/empresa/";
        const response = await fetch(urlServer, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            mode: "cors",
            body: JSON.stringify({
                nombre: formData.nombre,
                razonSocial: formData.razonSocial,
                cuil: formData.cuil,
                
            }),
        });

        if (!response.ok) {
            // throw new Error(HTTP error! status: ${response.status});
        }
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
}