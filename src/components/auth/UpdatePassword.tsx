import { useSessionContext } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { InputText } from '../inputs/InputText';
import { Button } from '../inputs/Button';
import { Card } from '../layouts/Card';

export const UpdatePassword = () => {
  const { supabaseClient } = useSessionContext();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Le mot de passe a été mis à jour.');

      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe :', error);
      toast.error('Une erreur est survenue lors de la mise à jour du mot de passe.');
    }
  };

  return (
    <Card>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <InputText
          id="newPassword"
          type="password"
          label="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <InputText
          id="confirmNewPassword"
          type="password"
          label="Confirmer le nouveau mot de passe"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <Button className="self-end" type="submit">
          Modifier le mot de passe
        </Button>
      </form>
    </Card>
  );
};
