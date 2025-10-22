'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    /**
     * Méthodes d'assistance définies par l'utilisateur.
     */
    static associate(models) {
      // Définir les associations avec d'autres modèles
      Bill.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient'
      });
      Bill.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId',
        as: 'appointment'
      });
    }
  }
  Bill.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id'
      }
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Une facture par rendez-vous
      references: {
        model: 'Appointments',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01, // Montant positif minimum
        max: 9999.99 // Montant maximum
      }
    },
    currency: {
      type: DataTypes.ENUM('EUR', 'USD', 'GBP'),
      allowNull: false,
      defaultValue: 'EUR' // Devise par défaut : Euro
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Date par défaut : maintenant
      validate: {
        isDate: true,
        isBefore: new Date().toISOString() // Date de facture avant aujourd'hui
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending' // Statut par défaut : en attente
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 1000] // Description entre 5 et 1000 caractères
      }
    }
  }, {
    sequelize,
    modelName: 'Bill',
  });
  return Bill;
};