import { NextApiHandler } from "next";
import api from "../../../libs/api";

const handleUpdate: NextApiHandler = async (req, res) => {
  const { id_user, id_product } = req.body;

  if(id_user && id_product) {
    const bag = await prisma?.bag.findFirst({
      where: {
        id_user: parseInt(id_user)
      }
    });

    if(bag) {
      const removeItem = await prisma?.bag.update({
        where: {
          id_user: parseInt(id_user)
        },
        data: {
          product: {
            disconnect: {
              id: parseInt(id_product)
            }
          }
        }
      });

      if(removeItem) {
        res.json(removeItem)
      };

      res.status(400).json("Não foi possível deletar o item da sacola")
    };

    res.status(400).json({ Error: "Sacola não encontrada" })
  };

  res.status(400).json({ Error: "Preencha todos os dados" })
};

const handleDelete: NextApiHandler = async (req, res) => {
  const { id_user } = req.body;

  if (id_user) {
    const user = await prisma?.user.findFirst({
      where: {
        id: id_user
      }
    });

    if (user) {
      const deleteBag = await prisma?.bag.delete({
        where: {
          id_user: parseInt(id_user)
        }
      });

      if (deleteBag) {
        res.status(200).json(deleteBag);
      };

      res.status(400).json("Falha ao deletar a sacola");
    };

    res.status(400).json({ Error: "Usuário não encontrado" })
  };

  res.status(400).json({ Error: "Preencha todos os dados" })
};

const handle: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "PUT":
      handleUpdate(req, res);
      break;
    case "DELETE":
      handleDelete(req, res);
      break
  };
};

export default handle;