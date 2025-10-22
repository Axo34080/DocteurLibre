'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Méthodes d'assistance définies par l'utilisateur.
     */
    static associate(models) {
      // Définir les associations avec d'autres modèles
      Patient.hasMany(models.Appointment, {
        foreignKey: 'patientId',
        as: 'appointments'
      });
      Patient.hasMany(models.Bill, {
        foreignKey: 'patientId',
        as: 'bills'
      });
    }
  }
  Patient.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50] // Longueur entre 2 et 50 caractères
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email unique dans la base de données
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^(\+33[\s.]?|0)[1-9]([\s.]?\d{2}){4}$/ // Format téléphone français
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString() // Date de naissance avant aujourd'hui
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 255] // Adresse entre 5 et 255 caractères
      }
    },
    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000] // Historique médical optionnel, max 1000 caractères
      }
    }
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};