import Angka from "../models/angkaModel.js";
import { Op } from "sequelize";

export const getAngkas = async(req, res) => {
    try {
        const response = await Angka.findAll();
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message);
    }
}

export const getAngkasById = async(req, res) => {
    try {
        const response = await Angka.findOne({
            where:{
                id:req.params.id
            }
        });
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message);
    }
}

export const createAngkas = async(req, res) => {
    try {
        await Angka.create(req.body);
        res.status(201).json({msg: 'Data Created'})
    } catch (error) {
        console.log(error.message);
    }
}


export const deleteAngkas = async(req, res) => {
    try {
        await Angka.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({msg: 'Data Deleted'})
    } catch (error) {
        console.log(error.message);
    }
}

export const getKepalaEkor = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search_kepala = req.query.search_kepala || "0";
    const search_ekor = req.query.search_ekor || "0";
    const search_hasil = req.query.search_hasil || "";

    const offset = limit * page;

    const totalData = await Angka.count()

    const totalDataHasil = await Angka.count({
        where:{
            [Op.or]: [{hasil:{
                [Op.like]: '%' + search_hasil + '%'
            }}]
        }
    })

    const totalDataEkor = await Angka.count({
        where:{
            [Op.or]: [{ekor:{
                [Op.like]: '%' + search_ekor + '%'
            }}]
        }
    })

    const totalDataKepala = await Angka.count({
        where:{
            [Op.or]: [{kepala:{
                [Op.like]: '%' + search_kepala + '%'
            }}]
        }
    })

    const totalDataPredict = await Angka.count({
        where:{
            [Op.and]: [
            {kepala:{
                    [Op.like]: '%' + search_kepala + '%'
                }},
            {ekor:{
                [Op.like]: '%' + search_ekor + '%'
            }},
            {hasil:{
                [Op.like]: '%' + search_hasil + '%'
            }}]
        }
    })
    
    const result = await Angka.findAll({
        where:{
            [Op.and]:[
                {kepala:{
                [Op.like]: '%' + search_kepala + '%'
            }},
            {ekor:{
                [Op.like]: '%' + search_ekor + '%'
            }},
            {hasil:{
                [Op.like]: '%' + search_hasil + '%'
            }}]
        },
        offset: offset,
        limit: limit,
        order:[
            ['id', 'DESC']
        ]
    })
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalData:totalData,
        totalDataKepala:totalDataKepala,
        totalDataHasil: totalDataHasil,
        totalDataEkor:totalDataEkor,
        totalDataPredict:totalDataPredict
    })
}

// export const getAngkasByEkor = async (req, res) => {
//     const page = parseInt(req.query.page) || 0;
//     const limit = parseInt(req.query.limit) || 10;
//     const search_ekor = req.query.ekor_search || "0";

//     const offset = limit * page;

//     const totalData = await Angka.count({
//         where:{
//             [Op.or]: [{ekor:{
//                 [Op.like]: '%' + search_ekor + '%'
//             }}]
//         }
//     })
    
//     const result = await Angka.findAll({
//         where:{
//             [Op.or]:[{ekor:{
//                 [Op.like]: '%' + search_ekor + '%'
//             }}]
//         },
//         offset: offset,
//         limit: limit,
//         order:[
//             ['id', 'DESC']
//         ]
//     })
//     res.json({
//         result: result,
//         page: page,
//         limit: limit,
//         totalData: totalData,
//     })
// }