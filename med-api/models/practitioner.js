'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Practitioner extends Model {
    /**
     * Méthodes d'assistance définies par l'utilisateur.
     */
    static associate(models) {
      // Définir les associations avec d'autres modèles
      Practitioner.hasMany(models.Appointment, {
        foreignKey: 'practitionerId',
        as: 'appointments'
      });
    }
  }
  Practitioner.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
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
      unique: true,
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
        is: /^(\+33[\s.]?|0)[1-9]([\s.]?\d{2}){4}$/
      }
    },
    specialty: {
      type: DataTypes.ENUM('cardiologue', 'dermatologue', 'generaliste', 'pediatre', 'psychiatre', 'ophtalmologue'),
      allowNull: false,
      validate: {
        isIn: [['cardiologue', 'dermatologue', 'generaliste', 'pediatre', 'psychiatre', 'ophtalmologue']] // Spécialités autorisées
      }
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[A-Za-z0-9]{8,20}$/ // Numéro de licence alphanumérique, 8-20 caractères
      }
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0, // Expérience minimale 0 ans
        max: 50 // Expérience maximale 50 ans
      }
    }
  }, {
    sequelize,
    modelName: 'Practitioner',
  });
  return Practitioner;
};